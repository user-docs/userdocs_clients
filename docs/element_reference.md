# Elements

Elements are the data object in UserDocs that represents a single HTML element on a page. Elements belong to pages, so that you can manage all the elements that participate in your automation together.

UserDocs identifies elements with a strategy and a selector. UserDocs supports css and xpath strategies. Currently, you must manually write and enter your css selectors. The UserDocs team will release additional tools in the near future that make it easier to automatically calculate selectors for you.

It is recommended that you learn about writing good css and xpath selectors, preferrably using unique identifiers like names and id's. Writing durable selectors will improve the reliability of your automation, and the quality of your annotations. Frequently, automatically calculated selectors leave something to be desired, and must be modified to be durable.

It is recommended in the long term, that this automation be applied in conjunction with Engineering support. Having a front end engineer who is willing and resourced to augment the DOM will improve the testeability, and automateability of the page. The job of automating this function will be easier, and the quality of it will be better.

