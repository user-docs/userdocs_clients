## Click Step Form

Selecting Click from the Step Type select input will cause the Click form to render, displaying these fields:

![New Step Form Reference](images/step_form_reference_click.png)

1. **Element Selector** - Picks the element to associated with the step. UserDocs will locate the element with the strategy and selector specified on the object, and simulate a click on the object.
2. **Create Element** - Creates an empty element object, clearing the fields in the Element subform.
3. **Name** - A descriptive name of the element. Will be used in the UI, and in automatic naming schemes for the step.
4. **Strategy** - The strategy used to apply the selector. UserDocs supports CSS and xpath selectors.
5. **Selector** - The selector that UserDocs will use to locate the element.
6. **Transfer Selector** - This button will transfer the selector, automatically sent over from the automated browser from the 'Transferred Selector' element (designated by 8) into the selector field.
7. **Test Selector** - This button will highlight the selector in the automated browser window, to help you test your selector.
8. **Transferred Selector** - Displays the selector transferred over from the automated browser for review before transferring into the field.

> The Transfer Selector and Test Selector features are currently offline, and will be re-enabled in the near future.

## Accessible at
`/steps/:id/edit`