from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.chains import RetrievalQA
import pinecone
import openai
import spacy
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain.tools import BaseTool
from langchain.chains import LLMMathChain
from langchain.utilities import SerpAPIWrapper
from langchain.text_splitter import SpacyTextSplitter
from credentials import OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_API_ENV
from PyPDF2 import PdfReader


index_name = 'test-index'

def create_qa_bot(data):
    # Load the PDF data
    # loader = PyPDFLoader("/Users/wdevoest/Documents/eecs497/LeaseReader/misc/example_lease.pdf")
    # data = loader.load()
    #pdf_file_path = "/Users/wdevoest/Documents/eecs497/example_lease.pdf"
    #pdf_loader = PdfReader(open(pdf_file_path, "rb"))

    # Initialize an empty string to store the PDF text
    #data = ""

    # Iterate through the pages and extract text
    # for page_num in range(len(pdf_loader.pages)):
    #     page = pdf_loader.pages[page_num]
    #     data += page.extract_text()


    #nlp = spacy.load('en_core_web_sm')
    #doc = nlp(data)
    #texts = list(doc.sents)
    
    # text_splitter = SpacyTextSplitter()
    # text_splitter = SpacyTextSplitter()
    # texts = text_splitter.split_text(data)
    
    # Split the data into smaller documents
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
    texts = text_splitter.split_text(data)

    # Create embeddings
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)


    # Create a Pinecone index and add the documents to it
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)
    
    pinecone.Index(index_name=index_name).delete(delete_all=True)
     
    meta = []   
    for i in range(len(texts)):
        meta.append({'id': str(i)})
    # metadatas=meta
    docsearch = Pinecone.from_texts([t for t in texts], embeddings, index_name=index_name)

    
    return


def create_agent_gen_report():
    
    #gather embeddings and llm instance to make tool for agent
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)
    docsearch = Pinecone.from_existing_index(index_name, embeddings)
    
    llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
    
    contract_info = RetrievalQA.from_chain_type(
    llm=llm, chain_type="stuff", retriever=docsearch.as_retriever()
    )   


def agentAskQuestion(prompt):
    #gather embeddings and llm instance to make tool for agent
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)
    docsearch = Pinecone.from_existing_index(index_name, embeddings)
    
    llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
    
    contract_info = RetrievalQA.from_chain_type(
    llm=llm, chain_type="stuff", retriever=docsearch.as_retriever()
    ) 
    tools = [
    Tool(
        name="ContractQAInfo",
        func=contract_info.run,
        description="useful for when you need to answer questions about the housing contract. Input should be a fully formed question.",
    ),
    ]
    
    agent = initialize_agent(
    tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
    )
    
    answer = agent.run(prompt)
    
    return answer
    
      


def askQuestion(prompt):
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)
    docsearch = Pinecone.from_existing_index(index_name, embeddings)
    
    # Perform similarity search
    docs = docsearch.similarity_search(prompt, k = 7)
    
    print(docs)

    # Load the question answering chain
    llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
    chain = load_qa_chain(llm, chain_type="stuff")

    # Query the documents and get the answer
    answer = chain.run(input_documents=docs, question=prompt)
    
    source = chain.run(input_documents=docs, question="Return the exact embedding that contains the answer to the folling question. Only return the embedding and nothing else.  Question: " + prompt)
    # print("---------Actual Source -----------")
    # print(source)
    # print("---------- Answer ----------")
    return answer

    
    
    

# Usage example
# prompt = "How many roommates do I have?"
#create_qa_bot()
#create_agent_gen_report()
# answer = agentAskQuestion(prompt)
# answerSimple = askQuestion(prompt)
# print(answerSimple)
# print("---------- Agent Answer ----------")
# print(answer)