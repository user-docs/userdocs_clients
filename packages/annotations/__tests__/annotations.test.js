'use strict';

const fixtures = require('../fixtures/annotations.js')
const { applyAnnotation, badge } = require('../lib/annotations');
/*
test('applyAnnotation', () => {
  document.body.innerHTML = '<div><p id="t">Hello</p><p id="t2" style="top: 5px; left: 5px;">World</p></div>';
  const element = document.getElementById("t2");
  applyAnnotation(fixtures.badge, element)
  var badgeElement = document.getElementById(`userdocs-annotation-1-badge`)
  expect(badgeElement.classList.contains('userdocs-badge')).toBeTruthy();
})
*/
test('badge', () => {
  document.body.innerHTML = '<div><p id="t">Hello</p><p id="t2" style="top: 5px; left: 5px;">World</p></div>';
  const element = document.getElementById("t2")
  badge(fixtures.badge, element, {})
  var badgeElement = document.getElementById('userdocs-annotation-1-badge')
  expect(badgeElement.classList.contains('userdocs-badge')).toBeTruthy();
  expect(badgeElement.style.top).toBe('5px')
  expect(badgeElement.style.left).toBe('5px')
});
