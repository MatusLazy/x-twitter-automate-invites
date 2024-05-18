// Global variable for cookies
const cookies = document.cookie.split('; ').reduce((prev, current) => {
  const [name, value] = current.split('=');
  prev[name] = value;
  return prev;
}, {});

function generateClientTransactionID() {
  // Use a combination of timestamp and random string
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  return `${timestamp}-${randomString}`;
}

async function getUserId(username) {
  const csrfToken = cookies['ct0'];
  const clientTransactionID = generateClientTransactionID();

  const url = `https://x.com/i/api/graphql/qW5u-DAuXpMEG0zA1F7UGQ/UserByScreenName?variables=%7B%22screen_name%22%3A%22${username.toLowerCase()}%22%2C%22withSafetyModeUserFields%22%3Atrue%7D&features=%7B%22hidden_profile_likes_enabled%22%3Atrue%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Afalse%7D`;
  const headers = {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-client-transaction-id": clientTransactionID,
    "x-csrf-token": csrfToken,
    "x-twitter-active-user": "yes",
    "x-twitter-auth-type": "OAuth2Session",
    "x-twitter-client-language": "en"
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      mode: "cors",
      credentials: "include",
      referrer: `https://x.com/${username}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.user?.result?.rest_id;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function inviteToGroup(chatId, userIds) {
  const csrfToken = cookies['ct0'];
  const clientTransactionID = generateClientTransactionID();

  const url = "https://x.com/i/api/graphql/oBwyQ0_xVbAQ8FAyG0pCRA/AddParticipantsMutation";
  const headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-client-transaction-id": clientTransactionID,
    "x-csrf-token": csrfToken,
    "x-twitter-active-user": "yes",
    "x-twitter-auth-type": "OAuth2Session",
    "x-twitter-client-language": "en"
  };

  const body = JSON.stringify({
    variables: {
      addedParticipants: userIds,
      conversationId: chatId
    },
    queryId: "oBwyQ0_xVbAQ8FAyG0pCRA"
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      mode: "cors",
      credentials: "include",
      referrer: `https://x.com/messages/${chatId}/add`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully invited users to chat ID: ${chatId}`);
    return data;
  } catch (error) {
    console.error('Error inviting users:', error);
  }
}

function extractChatIDs() {
  const chatElements = document.querySelectorAll(".css-175oi2r [href^='/messages/']");
  const chatIDs = [];
  chatElements.forEach(element => {
    const href = element.getAttribute("href");
    const chatID = href.match(/\/messages\/(\w+)\/participants/);
    if (chatID && chatID.length > 1) {
      chatIDs.push(chatID[1]);
    }
  });
  return chatIDs;
}

async function main(usernames) {
  const currentUserId = cookies['twid'].split('u%3D')[1];
  const ids = [];
  for (const username of usernames) {
    const userId = await getUserId(username);
    if (userId && userId !== currentUserId) {
      ids.push(userId);
    } else if (userId === currentUserId) {
      console.log(`Skipping follow for current user: ${username}`);
    }
  }

  const chatIDs = extractChatIDs();
  for (const chatID of chatIDs) {
    await inviteToGroup(chatID, ids);
    await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for 4 seconds between invites
  }
}

// Example usage:
const usernames = [
  // Replace with your list of usernames - no @. Just plain username
  "username1",
  "username2",
];

// Run the main function with the usernames
await main(usernames);
