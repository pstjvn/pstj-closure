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
TEMPLATE_TMP_DIR=tpl

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
TERMPLATES_SOURCES = templates/*.soy

# Default build to execute on 'make'.
all: libdeps

#### Calls specific to library development (i.e. no application code) #####

# Provides the deps file for the library, should be available to the compiler to
# provide the types used as parameters but not really required.
# libdeps:
# 	python $(DEPSWRITER_BIN) \
# 	--root_with_prefix="./ ../../../$(APPS_PATH)$(APPDIR)/" \
# 	--output_file="deps.js"

libdeps:
	python $(DEPSWRITER_BIN) \
	--root_with_prefix="./animation/ ../../../$(APPS_PATH)$(APPDIR)/animation" \
	--root_with_prefix="./cast/ ../../../$(APPS_PATH)$(APPDIR)/cast" \
	--root_with_prefix="./color/ ../../../$(APPS_PATH)$(APPDIR)/color" \
	--root_with_prefix="./config/ ../../../$(APPS_PATH)$(APPDIR)/config" \
	--root_with_prefix="./control/ ../../../$(APPS_PATH)$(APPDIR)/control" \
	--root_with_prefix="./date/ ../../../$(APPS_PATH)$(APPDIR)/date" \
	--root_with_prefix="./debug/ ../../../$(APPS_PATH)$(APPDIR)/debug" \
	--root_with_prefix="./ds/ ../../../$(APPS_PATH)$(APPDIR)/ds" \
	--root_with_prefix="./error/ ../../../$(APPS_PATH)$(APPDIR)/error" \
	--root_with_prefix="./fx/ ../../../$(APPS_PATH)$(APPDIR)/fx" \
	--root_with_prefix="./graphics/ ../../../$(APPS_PATH)$(APPDIR)/graphics" \
	--root_with_prefix="./material/ ../../../$(APPS_PATH)$(APPDIR)/material" \
	--root_with_prefix="./math/ ../../../$(APPS_PATH)$(APPDIR)/math" \
	--root_with_prefix="./mvc/ ../../../$(APPS_PATH)$(APPDIR)/mvc" \
	--root_with_prefix="./ng/ ../../../$(APPS_PATH)$(APPDIR)/ng" \
	--root_with_prefix="./nodejs/ ../../../$(APPS_PATH)$(APPDIR)/nodejs" \
	--root_with_prefix="./object/ ../../../$(APPS_PATH)$(APPDIR)/object" \
	--root_with_prefix="./resource/ ../../../$(APPS_PATH)$(APPDIR)/resource" \
	--root_with_prefix="./storage/ ../../../$(APPS_PATH)$(APPDIR)/storage" \
	--root_with_prefix="./style/ ../../../$(APPS_PATH)$(APPDIR)/style" \
	--root_with_prefix="./themes/ ../../../$(APPS_PATH)$(APPDIR)/themes" \
	--root_with_prefix="./ui/ ../../../$(APPS_PATH)$(APPDIR)/ui" \
	--output_file="deps.js"

codegen:
	nodejs/compiler.js templates/icons.xml

$(TEMPLATE_TMP_DIR)/$(LOCALE)/*: templates/*
	java -jar $(SOY_COMPILER_JAR) \
	--shouldProvideRequireSoyNamespaces \
	--shouldGenerateJsdoc \
	--codeStyle concat \
	--cssHandlingScheme GOOG \
	--outputPathFormat '$(TEMPLATE_TMP_DIR)/{INPUT_FILE_NAME_NO_EXT}.soy.js' \
	$(TERMPLATES_SOURCES)

tpldeps: $(TEMPLATE_TMP_DIR)/$(LOCALE)/*
	python $(DEPSWRITER_BIN) \
	--root_with_prefix="./tpl/ ../../../$(APPS_PATH)$(APPDIR)/tpl" \
	--output_file="demos/deps.js"


.PHONY:

