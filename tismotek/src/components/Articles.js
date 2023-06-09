import './Articles.css';
import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [editingItemId, setEditingItemId] = useState('');
  const [editedText, setEditedText] = useState('');
  const [editedUrl, setEditedUrl] = useState('');
  const [header, setHeader] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesRef = collection(db, 'articles');
        const querySnapshot = await getDocs(articlesRef);

        const fetchedArticles = [];
        let fetchedHeader = '';
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (doc.id === 'header') {
            fetchedHeader = data.text;
          } else {
            fetchedArticles.push({
              id: doc.id,
              text: data.text,
              url: data.url,
            });
          }
        });

        setHeader(fetchedHeader);
        setArticles(fetchedArticles);
      } catch (error) {
        console.log('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleEditClick = (itemId, text, url) => {
    setEditingItemId(itemId);
    setEditedText(text);
    setEditedUrl(url);
  };

  const handleSaveClick = async () => {
    try {
      if (editingItemId === 'header') {
        const itemRef = doc(db, 'articles', 'header');
        await updateDoc(itemRef, { text: editedText });
        setHeader(editedText);
      } else {
        const itemRef = doc(db, 'articles', editingItemId);
        await updateDoc(itemRef, { text: editedText, url: editedUrl });
      }
      setEditingItemId('');
    } catch (error) {
      console.log('Error updating item:', error);
    }
  };

  const handleCancelClick = () => {
    setEditingItemId('');
    setEditedText('');
    setEditedUrl('');
  };

  const formatURL = (url) => {
    if (!url.includes('http://') && !url.includes('https://')) {
      return 'http://' + url;
    }
    return url;
  };

  const isEditing = editingItemId !== '';

  return (
    <div className='articles-container'>
      <h3>
        {editingItemId === 'header' ? (
          <div>
            <input
              type='text'
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          </div>
        ) : (
          <>{header}</>
        )}
        {auth.currentUser && !isEditing && (
          <button  type="button" className="btn btn-secondary" onClick={() => handleEditClick('header', header)}>ערוך</button>
        )}
      </h3>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            {editingItemId === article.id ? (
              <div>
                <input
                  type='text'
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <input
                  type='text'
                  value={editedUrl}
                  onChange={(e) => setEditedUrl(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <a href={formatURL(article.url)} target='_blank' rel='noopener noreferrer'>
                  {article.text}
                </a>
                {auth.currentUser && (
                  <button type="button" className="btn btn-secondary" onClick={() => handleEditClick(article.id, article.text, article.url)}>
                    ערוך
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
        {isEditing && (
          <li>
            <button  type="button" className="btn btn-success" onClick={handleSaveClick}>שמור</button>
            <button  type="button" className="btn btn-secondary" onClick={handleCancelClick}>בטל</button>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Articles;
