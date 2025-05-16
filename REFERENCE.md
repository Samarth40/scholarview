# ScholarView: Academic Paper Explorer

## Project Overview
ScholarView is a web application designed to help users browse, filter, and sort academic papers by various criteria, including citation count, within a tabbed interface for an enhanced user experience.

## Core Features
1. **Academic Paper Archive**
   - Display a collection of academic papers with metadata: title, authors, abstract, publication year, citation count, and source link.
2. **Filtering Options**
   - Filter papers by subject area, publication year, author, journal or conference.
3. **Sorting Mechanism**
   - Sort papers by citation count (descending), publication date (newest to oldest), and alphabetical order of titles.
4. **Tabbed User Interface**
   - Tabs for "All Papers", "Most Cited", "Recent Publications", and "Favorites" (if user accounts are implemented).

## Tech Stack
| Component         | Technology                |
|-------------------|--------------------------|
| Frontend          | React.js, Tailwind CSS   |
| State Management  | React Context API/Redux  |
| Backend (optional)| Node.js, Express.js      |
| Database (optional)| MongoDB/PostgreSQL      |
| Data Source       | OpenAlex API             |
| Deployment        | Vercel, Netlify, Heroku  |

## Development Steps
1. **Setup Project Structure**
   - Initialize React project
   - Configure Tailwind CSS
2. **Design UI Components**
   - Paper cards, filter sidebar, sorting dropdown, tabbed navigation
3. **Integrate OpenAlex API**
   - Fetch paper data, implement filtering and sorting
4. **Implement Tabbed Navigation**
   - Use React Router or component state
5. **Add Filtering and Sorting Functionality**
   - Functions to filter and sort data as per user input
6. **Testing and Deployment**
   - Test responsiveness and functionality
   - Deploy using chosen platform

## Sample Data Structure
```json
[
  {
    "title": "Understanding Machine Learning",
    "authors": ["John Doe", "Jane Smith"],
    "abstract": "An in-depth look into machine learning algorithms.",
    "year": 2020,
    "citations": 150,
    "journal": "Journal of AI Research",
    "link": "https://example.com/paper1"
  }
]
```

## Reference Links
- [OpenAlex API](https://docs.openalex.org/)
- [React.js](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux](https://redux.js.org/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Heroku](https://www.heroku.com/) 