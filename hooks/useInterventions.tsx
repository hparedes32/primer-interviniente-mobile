// import { useEffect, useState } from 'react';
// import { Intervention } from '../screens/AddIntervention';



// export const useIntervention = () => {

//     const [interventionState, setInterventionState] = useState<Intervention>({
//         observation: "",
//         location: ""
//     });
//     const interventionHook = (observ: string, locat: string) => {

//         setInterventionState({
//             observation: observ,
//             location: locat
//         });
//     }
//     useEffect(() => {
//         console.log('updating');
//       }, [interventionState])
//     return {
//         interventionState,
//         interventionHook
//     }

// }
