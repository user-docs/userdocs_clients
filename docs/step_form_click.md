The Click Step type clicks an element on a page. It has built in waits and retries. If the element doesn't render immediately, UserDocs will wait for it to appear before attempting to click. If this fails, UserDocs will wait and retry ten times, waiting longer on each retry. 

Selecting Click from the Step Type select input will cause the Click form to render, displaying these fields:The Click Step type is used to click on elements in a page. Selecting Click from the Step Type select input will cause the Click form to render, displaying these fields:

![New Step Form Reference](images/step_form_reference_click.png)

1. **Element Selector** - Picks the element to associated with the step. UserDocs will locate the element with the strategy and selector specified on the object, and simulate a click on the object.
2. **Create Element** - Creates an empty element object, clearing the fields in the Element subform.
3. **Element Subform** - For more information on the Element Subform, see [this related article](element_subform.md)

## Accessible at
`/steps/:id/edit`
