chrome.contextMenus.removeAll()
  chrome.contextMenus.create({
    id: 'full_screen_screenshot',
    title: 'Full Screen Screenshot',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: 'element_screenshot',
    title: 'Element Screenshot',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: 'badge',
    title: 'Badge Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: 'outline',
    title: 'Outline Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: 'badge_outline',
    title: 'Badge + Outline Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: 'blur',
    title: 'Blur Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: 'badge_blur',
    title: 'Badge + Blur Element',
    contexts: ['all']
  })