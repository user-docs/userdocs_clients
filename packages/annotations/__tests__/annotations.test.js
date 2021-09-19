'use strict';

const fixtures = require('../fixtures/annotations.js')
const { applyAnnotation, badge } = require('../lib/annotations');

test('applyAnnotation', () => {
  document.body.innerHTML = '<div><p id="t">Hello</p><p id="t2">World</p></div>';
  const element = document.getElementById("t2");
  applyAnnotation(fixtures.badge, element)
  var badgeElement = document.getElementById(`userdocs-annotation-1-badge`)
  expect(badgeElement.classList.contains('userdocs-badge')).toBeTruthy();
})

test('badge', () => {
  document.body.innerHTML = '<div><p id="t">Hello</p><p id="t2">World</p></div>';
  const element = document.getElementById("t2")
  badge(fixtures.badge, element, {})
  var badgeElement = document.getElementById(`userdocs-annotation-1-badge`)
  var locatorElement = document.getElementById(`userdocs-annotation-1-locator`)
  console.log(locatorElement)
  expect(badgeElement.classList.contains('userdocs-badge')).toBeTruthy();
});
