wp @production post create \
  --post_content="$(cat default_injected_css.md)" \
  --post_title='default-injected-css' \
  --post_status='publish' \
  --description='Instructions on Creating your First Process' \
  --post_type='docs' \
  --post_author='johns10davenport'


