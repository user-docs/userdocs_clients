wp @production post create \
  --post_content="$(cat step_form_navigate.md)" \
  --post_title='Navigation Step Form' \
  --post_status='publish' \
  --description='Document Describing the Annotation Subform' \
  --post_type='page' \
  --post_author='John Davenport'