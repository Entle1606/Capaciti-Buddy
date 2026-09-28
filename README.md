# CAPACITI Buddy

CAPACITI Buddy is an interactive chatbot designed to help CAPACITI candidates navigate their programme experience. It provides quick access to information about the CAPACITI programme, expectations, house rules, support contacts, learning requirements, and other general programme information.

The goal of CAPACITI Buddy is to make important programme information easier to find and understand without requiring candidates to search through multiple documents or repeatedly ask staff the same questions.

## Features

* Programme information and learning journey overview
* Programme streams and learning requirements
* Candidate expectations and professional conduct
* House rules and workplace guidelines
* Information about stipends, attendance, leave, and notices
* Support and contact information
* IT and facilities guidance
* YES programme information
* Frequently asked questions
* Natural-language question matching
* Quick-access programme information cards
* Knowledge-base powered responses
* Follow-up question support

## How It Works

CAPACITI Buddy uses a structured knowledge base together with a JavaScript-based retrieval system.

When a candidate enters a question:

1. The chatbot processes and tokenises the question.
2. Common words are filtered out.
3. Keywords, categories, content, and related terms are matched against the knowledge base.
4. The most relevant knowledge-base entries are ranked.
5. The chatbot returns the relevant information to the candidate.

The retrieval system also includes:

* Keyword matching
* Basic stemming
* Synonym expansion
* Fuzzy matching for minor spelling variations
* Phrase matching
* Follow-up question handling
* Special handling for broad programme-related questions

## Project Structure

```text
CAPACITI-Buddy/
│
├── CAPACITI_Buddy.html
├── capaciti_knowledge_base.json
├── knowledgeRetriever.js
└── README.md
```

### `CAPACITI_Buddy.html`

The main chatbot application. It contains the user interface, chatbot functionality, styling, and the embedded knowledge retrieval logic.

### `capaciti_knowledge_base.json`

The structured knowledge base containing CAPACITI programme information, frequently asked questions, policies, contacts, expectations, and other information used by the chatbot.

### `knowledgeRetriever.js`

A standalone version of the knowledge retrieval system. It can be used separately from the embedded retriever in the HTML application.

## Running the Project

CAPACITI Buddy is currently implemented as a browser-based application.

### Option 1: Open Directly

Download or clone the repository and open:

```text
CAPACITI_Buddy.html
```

in a web browser.

### Option 2: Run Using VS Code

1. Clone the repository.
2. Open the project folder in VS Code.
3. Open `CAPACITI_Buddy.html`.
4. Open the file in your browser.

For development, using a local server such as the VS Code Live Server extension is recommended.

## Example Questions

Candidates can ask questions such as:

```text
Tell me more about the programme.

What streams are available?

What are the programme requirements?

What is the stipend?

What is my notice period?

What are the house rules?

Who do I contact for IT issues?

What happens if I am sick?

What are the attendance requirements?

What is the YES programme?
```

## Knowledge Retrieval

The chatbot uses a lightweight retrieval approach rather than a large language model.

The retrieval system considers several pieces of information when determining the most relevant response:

* Keywords
* Categories
* Subcategories
* Knowledge-base content
* Synonyms
* Related terms
* Phrase matches
* Minor spelling differences

For example, terms such as `stipend`, `salary`, `pay`, and `payment` are treated as related concepts to improve query matching.

Broad queries are also handled separately when a general overview is more appropriate. For example:

```text
programme
```

and:

```text
tell me more about the programme
```

are directed to the general programme overview rather than unrelated knowledge-base entries that happen to contain the word "programme".

## Updating the Knowledge Base

Programme information can be updated by editing:

```text
capaciti_knowledge_base.json
```

Each knowledge-base entry generally contains:

```json
{
  "id": "unique-id",
  "category": "Category",
  "subCategory": "Subcategory",
  "keywords": [
    "keyword",
    "related term"
  ],
  "content": "Information provided to the candidate."
}
```

When adding new information, use clear keywords and related phrases to improve retrieval accuracy.

## Technology

The project currently uses:

* HTML5
* CSS3
* JavaScript
* JSON
* Git
* GitHub

No external backend or database is currently required to run the browser-based chatbot.

## Development

The project is maintained using Git and GitHub.

The main development branch is:

```text
feature/capaciti-buddy
```

Typical workflow:

```bash
git pull
git add .
git commit -m "Describe your changes"
git push
```

Before committing changes, test the chatbot and confirm that existing questions still return the correct information.

## Testing

When making changes to the retrieval system or knowledge base, test both broad and specific questions.

### Programme

```text
programme
tell me about the programme
tell me more about the programme
```

These should return the general programme overview.

### Specific information

```text
what is my notice period?
what is the stipend?
what streams are available?
```

These should return the corresponding specific knowledge-base entries.

Testing both broad and specific queries helps prevent generic terms such as "programme" from incorrectly matching unrelated information.

## Future Improvements

Potential future improvements include:

* Connecting the chatbot to a backend API
* Adding an administrative interface for updating the knowledge base
* Improving natural-language understanding
* Adding conversation history and richer follow-up handling
* Adding authentication for candidate-specific information
* Adding analytics to identify common candidate questions
* Improving accessibility and mobile responsiveness
* Deploying the chatbot as a hosted web application
* Integrating an AI/LLM layer for more conversational responses

## Contribution

Team members can contribute by creating a feature branch, making changes, testing the chatbot, and submitting the changes for review.

Example:

```bash
git checkout -b feature/my-change
```

After making and testing changes:

```bash
git add .
git commit -m "Describe the change"
git push origin feature/my-change
```

## Project Purpose

CAPACITI Buddy was created to provide candidates with a simple, accessible way to find programme information and understand where to go for support.

The project focuses on reducing information gaps and improving the candidate experience throughout the CAPACITI programme.

## Authors

Developed as a collaborative CAPACITI project by the project team.

## Repository

**CAPACITI Buddy**

GitHub repository:

`https://github.com/Entle1606/Capaciti-Buddy`


