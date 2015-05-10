PYTHON := python2 -B
POSTPROCESS := $(PYTHON) utility/postprocess.py

translation:
	$(PYTHON) utility/translation.py i18n

translators:
	$(PYTHON) utility/translators.py i18n

vocabulary:
	$(PYTHON) utility/vocabulary.py

.SILENT: vocabulary
