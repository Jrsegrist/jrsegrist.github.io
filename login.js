const Cookies = window.Cookies;

if (window.location.href.includes("code=")) {
  (async() => {

    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    const authCodeFromURL =  getUrlVars()["code"];

    try {
      const code = authCodeFromURL;
      const api_url = `bungie-api/${code}`;
      const response = await fetch(api_url);
      const json = await response.json();
      const access_token = json.bungie_token.access_token;
      console.log(json);
      console.log(json.bungie_token.access_token);

      Cookies.set('BungieAccessToken', json.bungie_token.access_token);
      Cookies.set('BungieMemberID', json.bungie_token.membership_id);

    } catch (error) {
      console.error(error);
    }
  })();
}