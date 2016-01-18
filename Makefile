include Makefile.include

private_source_dirs := tpl demos
template_build_dir := tpl

soy_compiler_options = \
--shouldProvideRequireSoyNamespaces \
--shouldGenerateJsdoc \
--outputPathFormat \
'$(template_build_dir)/{INPUT_FILE_NAME_NO_EXT}.soy.js'

public_deps_cmdline = $(shell echo $(public_source_dirs) | sed 's+$(sed_tokenizer)+$(sed_deps_subst)+g')
private_deps_cmdline = $(shell echo $(private_source_dirs) | sed 's+$(sed_tokenizer)+$(sed_deps_subst)+g')

# Defines the files that should trigger rebuilding of the ppublic dependency file.
public_dep_file_deps := $(shell for folder in $(public_source_dirs) ; do find $$folder -name '*.js' ; done)
private_dep_file_deps = $(template_build_dir)/*.soy.js demos/*/*.js

# all: $(lintfile) $(private_deps_file) $(public_deps_file)
all: $(private_deps_file) $(public_deps_file)
	@echo '>>> pstj library all done'

$(lintfile): $(public_dep_file_deps) demos/*/*.js
	$(lint_cmd) $?
	touch $@

$(template_build_dir):
	mkdir $@

$(private_deps_file): $(private_dep_file_deps)
	$(python) $(depswriter) $(private_deps_cmdline) --output_file=$@

$(public_deps_file): $(public_dep_file_deps)
	$(python) $(depswriter) $(public_deps_cmdline) --output_file=$@

$(template_build_dir)/*.soy.js: $(template_source_dir)/*.soy
	$(java) $(soy_compiler) $(soy_compiler_options) $(template_source_dir)/*.soy

templates/icons.soy: templates/icons.xml
	node nodejs/icongen.js $?
