import yaml
import subprocess
import re
import logging

meta_file = open("docs_meta.yml")
meta_data = yaml.safe_load(meta_file)
base_image_url = "https://userdocs-test.s3.us-east-2.amazonaws.com/screenshots/"

docs = meta_data['docs']

def rewrite_links(content, docs):
  pattern = r'(?<!\!)\[[^\]]+\]\(([^)]+)\.md\)'
  result = re.findall(pattern, content)
  for name in result:
    logging.debug("Attempting to rewrite link for " + name)
    doc = get_doc(docs, name)
    try:
      slug = doc["post_name"]
    except TypeError:
      logging.error("Doc not found for " + name + ", link won't get rewritten")
      slug = ""
    content = rewrite_link(content, name, slug)

  return content

def rewrite_link(content, name, slug):
  file_name = name + ".md"
  link = "/" + slug
  return content.replace(file_name, link)

def get_doc(docs, name):
  for doc in docs:
    if doc["file_name"] == name + ".md":
      return doc

for doc in docs:
  logging.info(f'publishing {doc["file_name"]}')
  id = str(doc["id"])
  post_title = doc["post_title"]
  post_status = doc["post_status"]
  post_type = doc["post_type"]
  post_author = doc["post_author"]
  description = doc["description"]
  post_parent = doc["post_parent"]
  post_category = doc["post_category"]
  post_file = open(doc["file_name"])
  post_content = post_file.read()
  post_content = post_content.replace("images/", base_image_url)
  post_content = rewrite_links(post_content, docs)
  args = [
    'wp', '@production', 'post', 'update', id, 
    f'--post_title={post_title}',
    f'--post_status="{post_status}"',
    f'--post_type="{post_type}"',
    f'--post_author="{post_author}"',
    f'--description="{description}"',
    f'--post_content={post_content}',
    f'--post_parent={post_parent}',
    f'--post_category={post_category}'
  ]
  process = subprocess.run(args)