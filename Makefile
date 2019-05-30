include Makefile.include

private_source_dirs := tpl demos
template_build_dir := tpl

soy_compiler_options = \
--shouldGenerateGoogMsgDefs \
--useGoogIsRtlForBidiGlobalDir \
--outputPathFormat \
'$(template_build_dir)/{INPUT_FILE_NAME_NO_EXT}.soy.js'

public_deps_cmdline = $(shell echo $(public_source_dirs) | sed 's+$(sed_tokenizer)+$(sed_deps_subst)+g')
private_deps_cmdline = $(shell echo $(private_source_dirs) | sed 's+$(sed_tokenizer)+$(sed_deps_subst)+g')

js_src = $(shell echo $(public_source_dirs) | sed 's+$(sed_tokenizer)+--js="./&/**.js"+g')

# Defines the files that should trigger rebuilding of the ppublic dependency file.
public_dep_file_deps := $(shell for folder in $(public_source_dirs) ; do find $$folder -name '*.js' ; done)
private_dep_file_deps = $(template_build_dir)/*.soy.js demos/*/*.js demos/*/*/*.js

all: $(lintfile) $(private_deps_file) $(public_deps_file)
	@echo '>>> pstj library all done'

$(lintfile): $(public_dep_file_deps) demos/*/*.js
	clang-format -style=Google -i $?
	$(lint_cmd) $?
	touch $@

$(template_build_dir):
	mkdir $@

$(private_deps_file): $(private_dep_file_deps)
	$(python) $(depswriter) $(private_deps_cmdline) --output_file=$@

$(public_deps_file): $(public_dep_file_deps)
	$(python) $(depswriter) $(public_deps_cmdline) --output_file=$@

$(template_build_dir)/%.soy.js: $(template_source_dir)/%.soy
	$(java) $(soy_compiler) $(soy_compiler_options) --srcs $?

templates/icons.soy: templates/icons.xml
	node nodejs/icongen.js $?

schemes: schemes/*.json
	mkdir -p autogenerated/ds/
	node nodejs/dtogen.js pstj.gen.dto schemes autogenerated/ds/

lint:
	$(lint_cmd) \
			$(shell for folder in $(public_source_dirs) ; do find $$folder -name '*.js' ; done) \
			demos/*/*.js demos/*/*/*.js

blia:
	@echo $(python) $(depswriter)  $(private_deps_cmdline)

single:
	java -jar ../../compiler/compiler.jar \
			--charset=UTF-8 \
			--dependency_mode=STRICT \
			--entry_point=goog:$(ns) \
			--define='goog.LOCALE="en"' \
			--define='goog.DEBUG=true' \
			--process_closure_primitives \
			--use_types_for_optimization \
			--compilation_level=ADVANCED \
			--assume_function_wrapper \
			--jscomp_warning accessControls --jscomp_warning ambiguousFunctionDecl --jscomp_warning checkEventfulObjectDisposal --jscomp_warning checkRegExp --jscomp_warning checkTypes --jscomp_warning checkVars --jscomp_warning const --jscomp_warning constantProperty --jscomp_warning deprecated --jscomp_warning duplicateMessage --jscomp_warning es5Strict --jscomp_warning externsValidation --jscomp_warning fileoverviewTags --jscomp_warning globalThis --jscomp_warning internetExplorerChecks --jscomp_warning invalidCasts --jscomp_warning misplacedTypeAnnotation --jscomp_warning missingProperties --jscomp_warning missingProvide --jscomp_warning missingRequire --jscomp_warning missingReturn --jscomp_warning nonStandardJsDocs --jscomp_warning suspiciousCode --jscomp_warning strictModuleDepCheck --jscomp_warning typeInvalidation --jscomp_warning undefinedNames --jscomp_warning undefinedVars --jscomp_warning unknownDefines --jscomp_warning uselessCode --jscomp_warning visibility \
			--new_type_inf  \
			--formatting=PRETTY_PRINT \
			--js_output_file=.artefact \
			$(js_src) --js=./demos/**.js \
			--js="../../templates/soyutils_usegoog.js" \
			--js="../../library/closure/goog/**.js" \
			--js="../../library/third_party/closure/goog/mochikit/async/deferred.js" \
			--js="../../library/third_party/closure/goog/mochikit/async/deferredlist.js" \
			--js="!**_test.js" \
			--js="!*/*/node_modules/**.js"
