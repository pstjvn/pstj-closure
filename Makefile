#This makefile assumes you have your tools in a parent directory as follow
# __someparentfoler__
# 	compiler/
# 		compiler.jar
# 	library/
# 		svn checkout of the latest closure library
# 	stylesheets/
# 		cs.jar
# 	templates/
# 		SoyToJsCompiler.jar
# 		soyutils.js
# 		soyutils_usegoog.js
# 	apps/
# 		@yourproject
# 	jsdoc/
# 		plugins/removegoog.js
#
#
# 	Project structure:
# 	/ - list of html files to load. $(NS).html format is preferred.
# 	assets/ - all images and static assets (fonts etc).
# 	build/ - the build files will be put in there.
# 	gss/ - gss source files in this directory will be always included.
# 		common/ - gss source files in this directory will also be always included, but are considered imported from elsewhere (i.e. not project specific)
# 		$(NS)/ - gss sources that are specific to the name space that is being build.
# 	js/ - tree of JavaScript files that will be available to the project (project specific). Could include a sub-module with another project if needed.
# 		templates/ - flat list of soy files to compile.
# 	tpl/ - list of locales that have been built
# 		$(LOCALE)/ - locale specific build of the templates.



# This should match most projects.
APPDIR=$(shell basename `pwd`)

# The default name space to build. Could be modified on the command line.
NS=app

# The directory name to use as a build target directory. All compiled
# JavaScript, CSS and dependency files will be stored there. The directory is
# considered dirty and is ignored by Git.
BUILDDIR=build

# The directory to put translation files in.
I18NDIR=i18n

# Option to localize / internationalize the project. Set to desired locale when
# compiling. The locale is propagated to the closure compiler.
LOCALE=en

# Where the compiled templates should be kept
# Basically we want them out of the build dir as they are not a build result of its own
TEMPLATE_TMP_DIR=tpl/

# The sources of the templates.
TEMPLATES_SOURCE_DIR=templates/

########################################
# Service variables. Please change those only if you know what you are doing!!!
#######################################
LIBRARY_PATH=../../library/
DEPSWRITER_BIN=$(LIBRARY_PATH)closure/bin/build/depswriter.py
TEMPLATES_PATH=../../templates/
APPS_PATH=apps/
COMPILER_JAR=../../compiler/compiler.jar
EXTERNS_PATH=../../externs/
STYLES_COMPILER_JAR=../../stylesheets/cs.jar
SOY_COMPILER_JAR=../../templates/SoyToJsSrcCompiler.jar
MESSAGE_EXTRACTOR_JAR=../../templates/SoyMsgExtractor.jar

define newline


endef

define INDEXFILE
<!doctype html>
<html>
	<head>
		<title></title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" href="build/$(NS).css" type="text/css">
	</head>
	<body>

		<script src="build/$(NS)-cssmap.js"></script>
		<script src="../../library/closure/goog/base.js"></script>
		<script src="../pstj/deps.js"></script>
		<script src="build/deps.js"></script>
		<script>goog.require('$(NS)');</script>

		<!--

		<script src="build/$(NS).build.js"></script>

		-->
	</body>
</html>
endef

define APPFILE
goog.provide('$(NS)');
$(NS) = function() {};
endef

# Make sure we use all warnings for the lib files.
define BUILDOPTIONSFILE
--compilation_level=ADVANCED_OPTIMIZATIONS
--warning_level=VERBOSE
--js=../../library/closure/goog/deps.js
--js=../pstj/deps.js
--use_types_for_optimization
--jscomp_warning accessControls
--jscomp_warning ambiguousFunctionDecl
--jscomp_warning checkTypes
--jscomp_warning checkVars
--jscomp_warning visibility
--jscomp_warning checkRegExp
--jscomp_warning invalidCasts
--jscomp_warning strictModuleDepCheck
--jscomp_warning typeInvalidation
--jscomp_warning undefinedVars
--jscomp_warning unknownDefines
--jscomp_warning uselessCode
--externs=../../externs/webkit_console.js
endef

define CSSINI
--allowed-non-standard-function color-stop
--allowed-non-standard-function blur
--allowed-unrecognized-property -webkit-filter
--output-renaming-map-format CLOSURE_UNCOMPILED
--rename NONE
--pretty-print
endef

define CSSBUILDINI
--allowed-non-standard-function color-stop
--allowed-non-standard-function blur
--allowed-unrecognized-property -webkit-filter
--output-renaming-map-format CLOSURE_COMPILED
--rename CLOSURE
endef

define GITIGNOREFILE
build/
$(TEMPLATE_TMP_DIR)
help/
*sublime-*
endef

# Default build to execute on 'make'.
all: libdeps

################ Application level setups #####################

# write dep file in js/build/
# This should happen AFTER building the templates as to assure the templates
# have all the provides needed for the dependencies.
deps:
	python $(DEPSWRITER_BIN) \
	--root_with_prefix="$(TEMPLATES_PATH) ../$(TEMPLATES_PATH)" \
	--root_with_prefix="js ../../../$(APPS_PATH)$(APPDIR)/js" \
	--root_with_prefix="$(TEMPLATE_TMP_DIR)/$(LOCALE) ../../../$(APPS_PATH)/$(APPDIR)/$(TEMPLATE_TMP_DIR)/$(LOCALE)/" \
	--output_file="$(BUILDDIR)/deps.js"

# Compile template soy files from js/templates/ and put them in tpl/$(LOCALE)/
tpl:
	java -jar $(SOY_COMPILER_JAR) \
	--locales $(LOCALE) \
	--messageFilePathFormat "$(I18NDIR)/translations_$(LOCALE).xlf" \
	--shouldProvideRequireSoyNamespaces \
	--shouldGenerateJsdoc \
	--codeStyle concat \
	--cssHandlingScheme GOOG \
	--outputPathFormat '$(TEMPLATE_TMP_DIR)/$(LOCALE)/{INPUT_FILE_NAME_NO_EXT}.soy.js' \
	$(TEMPLATES_SOURCE_DIR)/*.soy

# Extracts the translation messages from the templates in a file
# Translated file should be used to compile to a different locale.
extractmsgs:
	java -jar $(MESSAGE_EXTRACTOR_JAR) \
	--outputFile "$(I18NDIR)/translations_$(LOCALE).xlf" \
	--targetLocaleString $(LOCALE) \
	$(TEMPLATES_SOURCE_DIR)/*.soy


# Create CSS file for name space and put name mapping in js/build/
css:
	java -jar $(STYLES_COMPILER_JAR) \
	`cat options/css.ini | tr '\n' ' '` \
	--output-file $(BUILDDIR)/$(NS).css \
	--output-renaming-map $(BUILDDIR)/$(NS)-cssmap.js \
	gss/*.gss \
	gss/$(NS)/*.gss

# Build the css into one file using renaming policy (minification).
cssbuild:
	java -jar $(STYLES_COMPILER_JAR) \
	`cat options/cssbuild.ini | tr '\n' ' '` \
	--output-file $(BUILDDIR)/$(NS).css \
	--output-renaming-map $(BUILDDIR)/cssmap-build.js \
	gss/*.gss \
	gss/$(NS)/*.gss


compile: cssbuild tpl deps
	python $(LIBRARY_PATH)/closure/bin/build/closurebuilder.py \
	-n $(NS) \
	--root=js/ \
	--root=$(TEMPLATE_TMP_DIR)/$(LOCALE)/ \
	--root=$(TEMPLATES_PATH) \
	--root=$(LIBRARY_PATH) \
	-o compiled \
	-f --define='goog.LOCALE="$(LOCALE)"' \
	-c $(COMPILER_JAR) \
	-f --flagfile=options/compile.ini \
	--output_file=$(BUILDDIR)/$(NS).build.js
	rm $(BUILDDIR)/cssmap-build.js

######################### Debugging and work flow set ups ######################

debug: css
	python $(LIBRARY_PATH)/closure/bin/build/closurebuilder.py \
	-n $(NS) \
	--root=js/ \
	--root=$(TEMPLATE_TMP_DIR)/$(LOCALE)/ \
	--root=$(TEMPLATES_PATH) \
	--root=$(LIBRARY_PATH) \
	-o compiled \
	-c $(COMPILER_JAR) \
	-f --define="goog.LOCALE $(LOCALE)" \
	-f --debug \
	-f --flagfile=options/compile.ini \
	--output_file=$(BUILDDIR)/$(NS).build.js
	rm $(BUILDDIR)/cssmap-build.js

# Create a structure for a new closure project.
initproject:
	mkdir -p gss/$(NS) js $(TEMPLATES_SOURCE_DIR) $(I18NDIR) $(BUILDDIR) \
	assets $(TEMPLATE_TMP_DIR) options
	touch index.html
	touch js/$(NS).js
	touch $(TEMPLATES_SOURCE_DIR)/$(NS).soy
	touch gss/$(NS)/$(NS).gss
	touch gss/base.gss
	touch options/{css.ini,cssbuild.ini,compile.ini}
	echo '$(subst $(newline),\n,${INDEXFILE})' > index.html
	echo '$(subst $(newline),\n,${APPFILE})' > js/$(NS).js
	echo '$(subst $(newline),\n,${CSSINI})' > options/css.ini
	echo '$(subst $(newline),\n,${CSSBUILDINI})' > options/css.ini
	echo '$(subst $(newline),\n,${BUILDOPTIONSFILE})' > options/compile.ini
	echo '$(subst $(newline),\n,${GITIGNOREFILE})' > .gitignore

# Run the compalier against a specific name space only for the checks.
# This includes the templates (so it is compatible with applications and the
# library as well).
#
# To use it with application code replace the first root include to js/
check:
	python ../../library/closure/bin/build/closurebuilder.py \
	-n $(NS) \
	--root=./ \
	--root=$(TEMPLATES_PATH) \
	--root=$(LIBRARY_PATH) \
	-o compiled \
	-c $(COMPILER_JAR) \
	-f --flagfile=options/compile.ini \
	--output_file=/dev/null


#### Calls specific to library development (i.e. no application code) #####

# Provides the deps file for the library, should be available to the compiler to
# provide the types used as parameters but not really required.
libdeps:
	python $(DEPSWRITER_BIN) \
	--root_with_prefix="./ ../../../$(APPS_PATH)$(APPDIR)/" \
	--output_file="deps.js"

demos: tpl libdeps

.PHONY: tpl css cssbuild deps all compile check

