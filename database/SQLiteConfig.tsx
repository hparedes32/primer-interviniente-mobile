import { Alert } from "react-native";
import { openDatabase } from "expo-sqlite";
import { Intervention } from "../models/intervention";

const db = openDatabase("UserDatabase.db");


// export const initDB = () => {
//   const promise = new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "CREATE TABLE IF NOT EXISTS interventions(id INTEGER PRIMARY KEY AUTOINCREMENT, observation TEXT, location TEXT, imageUrl TEXT, type TEXT, recordings TEXT, createdOn TEXT, userId TEXT)",
//         [],
//         () => {
//           resolve();
//         },
//         (_, err) => {
//           reject(err);
//         }
//       );
//     });
//   });
//   return promise;
// };

export const initDB = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS interventions(id INTEGER PRIMARY KEY AUTOINCREMENT, observation TEXT, location TEXT, imageUrl TEXT, type TEXT, recordings TEXT, createdOn TEXT, userId TEXT)",
        [],
        () => {
          console.log('Tabla creada con éxito');
        },
        error => {
          console.log('Error al crear la tabla:', error);
        }
      );
    });
  });
  return promise;
};

export const addIntervention = (intervention: Intervention) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO interventions (observation, location, imageUrl, type, recordings, createdOn, userId) VALUES (?,?,?,?,?,?,?)",
        [intervention.observation, intervention.location, intervention.imageUrl, intervention.type, intervention.recordings, intervention.createdOn, intervention.userId],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          console.log("Error while inserting data", err);
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const fetchInterventionDetail = (id: number) => {

  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM interventions WHERE id = ?",
        [id],
        (_, { rows }) => {
          rows._array[0].imageUrl = JSON.parse(rows._array[0].imageUrl);
          rows._array[0].recordings = JSON.parse(rows._array[0].recordings);
          resolve(rows._array[0]);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};


export const fetchInterventions = (userId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM interventions WHERE userId = ?",
        [userId],
        (_, results) => {
          const intervs= [];
          for (const item of results.rows._array) {
            intervs.push(
              new Intervention(item.observation, item.location, item.imageUrl,item.type, item.recordings, item.createdOn, item.userId, item.id)
              );
          }
          resolve(intervs);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const dropTableInterventions = () => {
  console.log("dropTableInterventions");
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE interventions",
        [],
        (_, results) => {
          console.log("Results", results);
          resolve(results);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};
export const deleteInterventionsTable = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from interventions",
        [],
        (_, results) => {
          console.log("Results", results);
          resolve(results);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const SQLiteConfig = () => {
  const deleteIntervention = async (id) => {
    (await db).transaction(async (tx) => {
      await tx.executeSql(
        "DELETE FROM interventions WHERE id = ?",
        [id],
        (tx, results) => {
          console.log("Results", results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert("Intervención eliminada correctamente");
          } else {
            Alert.alert("Error al eliminar la intervención");
          }
        },
        (error) => {
          console.log("Error while inserting data", error);
        }
      );
    });
  };
  const updateIntervention = async (observation, location, id) => {
    (await db).transaction(async (tx) => {
      await tx.executeSql(
        "UPDATE interventions SET observation = ?, location = ? WHERE id = ?",
        [observation, location, id],
        (tx, results) => {
          console.log("Results", results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert("Intervención actualizada correctamente");
          } else {
            Alert.alert("Error al actualizar la intervención");
          }
        },
        (error) => {
          console.log("Error while inserting data", error);
        }
      );
    });
  };
  const getIntervention = async (id: any) => {
    (await db).transaction(async (tx) => {
      await tx.executeSql(
        "SELECT * FROM interventions WHERE id = ?",
        [id],
        (tx, results) => {
          console.log("Results", results.rows.length);
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              console.log(results.rows.item(i));
            }
          } else {
            console.log("No interventions found");
          }
        },
        (error) => {
          console.log("Error while inserting data", error);
        }
      );
    });
  };

  return {
    addIntervention,
    deleteIntervention,
    updateIntervention,
    getIntervention,
  };
};


