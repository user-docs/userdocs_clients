This week at Userdocs, we're working on refactoring the Userdocs API client to be an independent Elixir Application that runs inside Userdocs Desktop.

We are working on the beta release of Userdocs. The beta release will be a native Elixir desktop application. It will run from data held in a local SQLite database, or from data retreived from the Userdocs server. 

Refactoring the client to a seperate, self contained application enables us to retreive data from the local database, and the remote host. We will be able to combine that data, and users will be able to work seamlessly with local and remote data.

The client refactor implements a caching strategy that has dramatically improved the performance of the application. That means that Userdocs Desktop will perform like a desktop application, instead of a web application that queries data on each load.

Additionally, we'll be able to leverage the standalone client to develop our CLI application

Once the refactor is complete, we'll be able to better free and individual plans for our users who want to use the product without ongoing fees. 

If you're interested in checking out the alpha version of Userdocs, or want to sign up for the waiting list for the beta, contact us!