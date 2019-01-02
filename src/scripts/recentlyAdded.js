import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import nodemailer from 'nodemailer';

const RECENTLY_ADDED_COUNT = 10;
const RECENT_ITEMS_URL = process.env.TAUTULLI_IP + '/api/v2?apikey=' + process.env.TAUTULLI_API_KEY + '&cmd=get_recently_added&count=' + RECENTLY_ADDED_COUNT;
const MEDIA_TYPES = {
    SHOWS: 'season',
    MOVIES: 'movie'
};

// Get the most recent plex items
axios.get(RECENT_ITEMS_URL)
    .then(response => emailItems(response))
    .catch(error => {
        console.log(error);
    });

// Email items from a HTTP response
function emailItems(response) {
    const recentlyAddedItems = processResponse(response);
    const emailBody = buildEmailBody(recentlyAddedItems);
    const recipients = [
        'kitarmstrongbc@gmail.com'
    ];

    sendEmail(emailBody, recipients);
}

// Send email HTML email
function sendEmail(bodyHtml, recipients) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_SERVER,
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
           ciphers:'SSLv3'
        },
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
      
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients,
        subject: 'Plex - Recently Added',
        html: bodyHtml
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
        }
    });
}

// Process the HTTP response and return items in array
function processResponse(response) {
    return response.data.response.data.recently_added.map(recentItem => (
        {
            type: recentItem.media_type,
            title: recentItem.title,
            rating: recentItem.rating,
            summary: recentItem.summary,
            show_title: recentItem.parent_title
        }
    ));
}

// Returns HTML for email body
function buildEmailBody(recentlyAddedItems) {
    let movieList;
    let showList;

    // Get the movies
    const movies = recentlyAddedItems.filter(recentItem => 
        recentItem.type == MEDIA_TYPES.MOVIES
    );

    if(movies) {
        movieList = '<h4>Movies</h4><ul style="list-style: none">';
        
        movies.forEach(movie => {
            movieList += `<li><span style="font-weight: 700;">${movie.title}</span> - Rated: ${movie.rating}/10<p style="font-style: italic">${movie.summary}</p></li>`;
        });

        movieList += '</ul>';
    }

    // Get the shows
    const shows = recentlyAddedItems.filter(recentItem => 
        recentItem.type == MEDIA_TYPES.SHOWS
    );

    if(shows) {
        showList = '<h4>TV Shows</h4><ul style="list-style: none">';
        
        shows.forEach(show => {
            showList += `<li><span style="font-weight: 700;">${show.show_title}</span> - ${show.title}</li>`;
        });

        showList += '</ul>';
    }

    // Add list to template
    const completeHtml = 
        `<h2>Plex Media Server</h2>
        <h3>Most Recently Added Movies and Shows</h3>
        ${showList}
        ${movieList}`;

    return completeHtml;
}