import { Link } from 'react-router-dom'
import Button from '../../../_general/Button/Button';

function Article(props) {
    let { date, sourceName, sourceLink, title, badge, img, content, words} = props;

    let articleText = '';
    
    const getBadgeClass = (badgeText) => {
        switch(badgeText) {
            case 'Технические новости':
                return 'tech';
            case 'Объявление':
                return 'announcement';
            case 'Дайджест':
                return 'digest';
            default:
                return 'interesting';
        }
    };
    
    try {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = content;
        let decodedContent = textarea.value;
        
        articleText = decodedContent
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 700);
            
        if (articleText.length === 700) {
            articleText += '...';
        }
        
    } catch (error) {
        console.error('Ошибка извлечения текста:', error);
        articleText = 'Не удалось загрузить содержимое статьи';
    }

    return (
        <div className='article_wrapper'>
            <div className='article'>
                <div className='article_params'>
                    <span className='article_params_date'>{date}</span>
                    <a className='article_params_link' href={sourceLink}>{sourceName}</a>
                </div>
                <span className='article_title'>{title}</span>
                <div className={`article_badge ${getBadgeClass(badge)}`}>{badge}</div>
                <img className='article_img' src={!img? require('../../../_assets/images/article_mock.jpg'): img} alt='article_img' />
                <div className='article_content'>{articleText}</div>
                <div className='article_footer'>
                <Link to={sourceLink}>
                    <Button
                        btnClass='article_btn'
                        btnName='Читать в источнике'
                        disabled={false}
                        onClick={()=>{}}
                    />
                </Link>
                    <div className='article_words'>{words} слова</div>
                </div>
            </div>
        </div>
    )
}

export default Article;
