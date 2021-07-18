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
    print("Attempting to rewrite link for " + name)
    doc = get_doc(docs, name)
    try:
      slug = doc["post_name"]
    except TypeError:
      logging.error("Doc not found for " + name + ", link won't get rewritten")
      slug = ""
    content = rewrite_link(content, name, "", slug)

  return content

def rewrite_link(content, name, path, slug):
  file_name = name + ".md"
  # link = "/" + path + slug # Looks unnecessary to rewrite the path
  link = "/" + slug
  return content.replace(file_name, link)

def get_doc(docs, name):
  for doc in docs:
    if doc["file_name"] == name + ".md":
      return doc

"""
This was to rewrite the path according to the parents. Looks unnecessary.
def get_doc_by_id(docs, id):
  for doc in docs:
    if doc["id"] == id:
      return doc

def get_parents(parents, docs, doc):
  parent_id = doc["post_parent"]
  if parent_id == 0:
    return reversed(parents)
  else:
    parent = get_doc_by_id(docs, parent_id)
    parents.append(parent['post_name'])
    parents = get_parents(parents, docs, parent)
    return parents

def build_path(parents):
  path = ""
  for parent in parents:
    path += parent + "/"

  return path
"""

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