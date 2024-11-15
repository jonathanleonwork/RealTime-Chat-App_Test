import { ref, get, query, orderByChild, equalTo } from "firebase/database";

export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(" ");

  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }

  return splitName[0][0];
}

export function transformToArr(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}

export function transformToArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map((toUserId) => {
        return { ...snapVal[toUserId], id: toUserId };
      })
    : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};
  updates[`/users/${userId}/${keyToUpdate}`] = value;

  const getMsgs = get(
    query(ref(db, "/messages"), orderByChild("author/uid"), equalTo(userId))
  );

  const getUsers = get(
    query(
      ref(db, "/users"),
      orderByChild("lastMessage/author/uid"),
      equalTo(userId)
    )
  );
  //   // Index not defined, add ".indexOn": "author/uid", for path "/messages", to the rules

  const [mSnap, rSnap] = await Promise.all([getMsgs, getUsers]);

  mSnap.forEach((msgSnap) => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });

  rSnap.forEach((userSnap) => {
    updates[`/users/${userSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });

  return updates;
}

export function groupBy(array, groupingKeyFn) {
  return array.reduce((result, item) => {
    const groupingKey = groupingKeyFn(item);

    if (!result[groupingKey]) {
      result[groupingKey] = [];
    }

    result[groupingKey].push(item);

    return result;
  }, {});
}
