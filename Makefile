# Directories. Add the dirs if added in the repo.
private_source_dirs := tpl demos

public_source_dirs := \
animation \
cast \
color \
config \
control \
date \
debug \
ds \
error \
fx \
graphics \
material \
math \
mvc \
ng \
object \
options \
resource \
storage \
style \
themes \
ui

template_source_dir := templates
template_build_dir := tpl



# Definitions
python = python
java = java -jar
closure_library = ../../library
closure_library_bin = $(closure_library)/closure/bin/build
depswriter = $(closure_library_bin)/depswriter.py
soy_compiler = ../../templates/SoyToJsSrcCompiler.jar



css_handling_scheme = GOOG

soy_compiler_options = \
--shouldProvideRequireSoyNamespaces \
--shouldGenerateJsdoc \
--codeStyle concat \
--cssHandlingScheme \
$(css_handling_scheme) \
--outputPathFormat \
'$(template_build_dir)/{INPUT_FILE_NAME_NO_EXT}.soy.js'

public_deps_file = deps.js
private_deps_file = demodeps.js

library_relative_path = ../../../
apps_dir = apps
this_dir = $(shell basename `pwd`)

sed_tokenizer = [^ ]*
sed_jsifier = &/*.js &/*/*.js
sed_unglob = 's+ [^ ]*\*[^ ]*++g'
sed_deps_subst = --root_with_prefix=&\\ $(library_relative_path)$(apps_dir)/$(this_dir)/&

public_deps_cmdline = $(shell echo $(public_source_dirs) | sed 's+$(sed_tokenizer)+$(sed_deps_subst)+g')
private_deps_cmdline = $(shell echo $(private_source_dirs) | sed 's+$(sed_tokenizer)+$(sed_deps_subst)+g')

# Defines the files that should trigger rebuilding of the ppublic dependency file.
public_dep_file_deps := $(shell for folder in $(public_source_dirs) ; do find $$folder -name '*.js' ; done)
private_dep_file_deps = $(template_build_dir)/*.soy.js demos/*/*.js


all: $(private_deps_file) $(public_deps_file)
	@echo '>>> pstj library all done'

$(template_build_dir):
	mkdir $@

$(private_deps_file): $(private_dep_file_deps)
	$(python) $(depswriter) $(private_deps_cmdline) --output_file=$@

$(public_deps_file): $(public_dep_file_deps)
	$(python) $(depswriter) $(public_deps_cmdline) --output_file=$@

$(template_build_dir)/*.soy.js: $(template_source_dir)/*.soy
	$(java) $(soy_compiler) $(soy_compiler_options) $(template_source_dir)/*.soy

templates/icons.soy: templates/icons.xml
	nodejs/compiler.js $?