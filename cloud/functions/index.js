Parse.Cloud.define('hello', (req) => {
  return 'Hi';
});

Parse.Cloud.define('goodbye', (req) => {
  return 'GoodBye';
});

Parse.Cloud.define('whoami', (req) => {
  const name = req.params.name;
  const money = req.params.money;

  const result = `Hello. ${name}! You will earn $${money}`;
  return result;
});

Parse.Cloud.define('getItemList', async (req) => {
  const Character = Parse.Object.extend("Character"); // Get class from database
  const query = new Parse.Query(Character);

  try {
    const result = await query.find();
    return result;
  } catch(error) {
    throw error;
  }
});

Parse.Cloud.define('signUp', async (req) => {
  const user = new Parse.User();
  const username = req.params.username;
  const password = req.params.password;

  user.set("username", username);
  user.set("password", password);
  user.set("cash", 10000);


  if (username == null || password == null) {
    throw Error('There is wrong inputs');
  }

  try {
    const result = await user.signUp();
    return result;
  } catch (error) {
    console.log("Error: " + error.code + " " + error.message);
    throw error;
  }
});

Parse.Cloud.define('purchaseItem', async (req) => {
  const user = req.user; // 세션 키를 이용해 유저 비교
  const objectId = req.params.objectId;
  const count = req.params.count;

  if(!user) {
    throw Error('There is no user');
  }

  const userCash = user.get('cash');

  const Character = Parse.Object.extend('Character');
  let character = new Character();
  character.id = objectId;

  const UserCharacter = Parse.Object.extend('UserCharacter');
  const userCharacterQuery = new Parse.Query(UserCharacter);

  try {
    character = await character.fetch();
    const characterPrice = character.get('price');
    const characterCount = character.get('count');

    if (characterCount < count) {
      throw Error('Not enough items');
    }

    if (userCash < characterPrice * count) {
      throw Error('Not enough cash');
    }

    userCharacterQuery.equalTo('user', user);
    userCharacterQuery.equalTo('character', character);
    let userCharacter = await userCharacterQuery.first();

    if (!userCharacter) {
      userCharacter = new UserCharacter();
    }

    character.increment('count', -count);
    user.increment('cash', -characterPrice * count);
    userCharacter.set('user', user);
    userCharacter.set('character', character);
    userCharacter.increment('count', count);

    await user.save(null, {useMasterKey: true});
    await userCharacter.save();
    return character.save();
  } catch(error) {
    throw error;
  }
});

Parse.Cloud.define('getUserItemList', async (req) => {
  const user = req.user;

  if (user == null) {
    throw Error('There is no user');
  }

  const UserCharacter = Parse.Object.extend('UserCharacter'); // Get class from database table
  const query = new Parse.Query(UserCharacter); // TODO: 클래스로부터 쿼리를 생성한다.
  query.equalTo('user', user); // TODO: 요청한 유저가 보유한 아이템만을 선택해야 한다.
  query.include('character');

  try {
    const result = await query.find(); // Get all datas
    return result;
  } catch (error) {
    throw error;
  }
});

Parse.Cloud.define('sellUserItem', async (req) => {
  const user = req.user;
  const objectId = req.params.objectId;

  if (user == null) {
    throw Error('There is no user');
  }

  const UserCharacter = Parse.Object.extend('UserCharacter'); // Get class from database
  let userCharacter = new UserCharacter();

  // TODO: obejectId를 통해 유저가 보유한 아이템을 매치시킨다.
  userCharacter.id = objectId;
  try {
    userCharacter = await userCharacter.fetch();  
  } catch (err) {
    throw err;
  }// TODO: 매치한 아이템 정보를 DB로부터 불러온다.
  
  let originalCharacter = await userCharacter.get('character').fetch(); // character 포인터 정보를 가져온다.
  const characterPrice = originalCharacter.get('price'); // character 가격 정보를 가져온다.

  try {
    const count = userCharacter.get('count');
    if (count <= 0) {
      throw Error('Not enought quantity');
    }

    originalCharacter.set('count', originalCharacter.get('count') + 1) // TODO: 오리지널 아이템(아이돌) 갯수를 1만큼 늘린다.
    userCharacter.set('count', userCharacter.get('count') - 1) // TODO: 유저가 보유한 아이템(아이돌) 갯수를 1만큼 감소시킨다.
    user.set('cash', user.get('cash') + characterPrice * 1); // TODO: 유저가 보유한 캐쉬를 아이템 가격만큼 늘린다.

    await originalCharacter.save(null, {useMasterKey: true});
    await user.save(null, {useMasterKey: true});
    return userCharacter.save(); // 유저가 보유한 아이템 정보를 저장 후 리턴한다.
  } catch (error) {
    throw Error(error);
  }
});