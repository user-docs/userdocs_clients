wp @production post update 217 \
  --post_content="$(cat process_reference.md)" \
  --post_title='Processes' \
  --post_status='publish' \
  --description='Document about Processes' \
  --post_type='page' \
  --post_author='John Davenport' 