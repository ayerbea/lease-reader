# Lease Reader
By Andres Ayerbe, William DeVoest, and Noah Mcguire
## Description

We aim to offer users a method to demystify the legal jargon in their legal housing documents by offering 
them a platform to query their lease and receive logically coherent descriptions of their tenant rights. 
In the short term, we wish to provide a simple user experience that allows users to upload their lease to our
website and interact with a chatbot that will communicate with our backend servers.

## Stretch goals
Our long term goal is to incorporate elements of jurisdictional law to create a logical structure for our generative AI model 
to be able to point out loopholes that it may find in a lease. This stretch goal is instrumental in our effort 
to not only make complicated leases digestible for users, but help them to not be scammed or exploited by housing companies. 

## Implementation
We have identified several technologies that will aid the backend logic to process the lease content – namely, Pinecone.io, 
OpenAI, and LangChain, where the LangChain library provides wrappers for accessing both Pinecone and OpenAI.

The backend will be wrapped by a Flask server and will communicate with a JavaScript React frontend.

##UI Preview
![image](https://github.com/ayerbea/lease-reader/assets/97454732/a68da906-362d-4374-8ba1-21eaa157d8af)
![image](https://github.com/ayerbea/lease-reader/assets/97454732/43eb3b49-f10d-49d5-a9f0-d4a773d67d88)

