const ParseURL = 'http://ch-4ml.iptime.org:1337/parse/functions/';
const RestURL = 'http://ch-4ml.iptime.org:1337/parse/';
const AppID = 'YOUR_PARSE_APP_ID';
const ContentType = 'application/json';
const FETCH_HEADERS = {
    "Content-Type": ContentType,
    "X-Parse-Application-Id": AppID
}

Parse.initialize('YOUR_PARSE_APP_ID');
Parse.serverURL = 'http://ch-4ml.iptime.org:1337/parse/';


class ParseApi {
    static async sayHello() {
        const response = await fetch(ParseURL + 'whoami', {
            method: "POST",
            headers: FETCH_HEADERS,
            body: JSON.stringify({
                "name": "아이유",
                "money": 100000000
            })
        });

        console.log(response);

        return response.json();
    }

    static async getItemList() {
        const response = await Parse.Cloud.run('getItemList');
        return response;
    }

    static async signUp(username, password) {
        // const response = await fetch(ParseURL + 'signUp', {
        //     method: "POST",
        //     headers: FETCH_HEADERS,
        //     body: JSON.stringify({
        //         username,
        //         password
        //     })
        // });

        // console.log(response);
        // return response.json();

        const response = await Parse.Cloud.run('signUp', {username, password});
        return response.toJSON();
    }

    static async signIn(username, password) {
        // const response = await fetch(RestURL + 'login', {
        //     method: "POST",
        //     headers: FETCH_HEADERS,
        //     body: JSON.stringify({
        //         username,
        //         password
        //     })
        // });
        // console.log(response);
        // return response.json();

        const user = await Parse.User.logIn(username, password);
        return user.toJSON();
    }

    static async logout() {
        let headers = FETCH_HEADERS;
        headers["X-Parse-Session-Token"] = localStorage.getItem('session');
        
        /*
        const anotherHeaders = {
            ...FETCH_HEADERS, // Destructuring assignment, 구조 분해 할당
            "X-Parse-Session-Token": localStorage.getItem('session')
        }
        */

        const response = await fetch(RestURL + 'logout', {
            method: "POST",
            headers: headers
        });
        console.log(response);
        return response.json();
    }

    static checkCurrentUser() {
        const user = Parse.User.current();

        if(user) {
            return user.toJSON();
        } else {
            return false;
        }
    }

    static async purchaseItem({objectId, count}) {
        try {
            const result = await Parse.Cloud.run('purchaseItem', {objectId, count});
            if (result) {
                return result.toJSON();
            } else {
                throw 'Something Wrong';
            }
        } catch (error) {
            throw error;
        }
    }

    static async getUserItemList() {
        try {
            const response = await Parse.Cloud.run('getUserItemList', {});
            let result = [];
            console.log('getUserItemList', response);
            if (response) {
                response.forEach(element => {
                    result.push(element.toJSON());
                });

                return result;
            } else {
                throw 'Something Wrong';
            }
        } catch (error) {
            throw error;
        }
    }

    static async sellUserItem(objectId) {
        try {
          const result = await Parse.Cloud.run('sellUserItem', { objectId: objectId });
          if (result) {
            return  result.toJSON();
          } else {
            throw 'Something Wrong';
          }
        } catch (error) {
          throw error;
        }
      }
}