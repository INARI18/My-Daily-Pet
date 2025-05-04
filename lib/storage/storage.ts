import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Pet {
    id?: number;
    icon: string | null;
    name: string;
    type: string;
    weight: number;
    age: number;
    gender: string;
    castration: boolean;
    vaccines?: { id: string; date: string }[];
    medications?: { id: string; date: string }[];
    showers?: { id: string; date: string }[];
    walks?: { id: string; date: string }[];
}

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const saveData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('Erro ao salvar os dados:', error);
    }
};

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.error('Error searching data:', error);
    }
};

export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing data:', error);
    }
};

export const savePet = async (petData: {
    name: string;
    type: string;
    weight: number;
    age: number;
    gender: string;
    icon: string;
    id?: string;
    vaccines?: { id: string; date: string }[];
    showers?: { id: string; date: string }[];
    medications?: { id: string; date: string }[];
    walks?: { id: string; date: string }[];
}) => {
    try {
        const pet = {
            ...petData,
            id: petData.id || generateUUID(),
            vaccines: petData.vaccines || [],
            showers: petData.showers || [],
            medications: petData.medications || [],
            walks: petData.walks || []
        };
        const value = JSON.stringify(pet);
        await saveData(`pet_${pet.id}`, value);

        // Debugging: Log the saved pet
        console.log('Pet saved:', pet);

        return pet; // Return the saved pet
    } catch (error) {
        console.error('Error saving pet:', error);
        throw error;
    }
};

export const getPet = async (petId: string) => {
    try {
        const value = await getData(`pet_${petId}`);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error searching pet:', error);
    }
};

export const removePet = async (petId: string) => {
    try {
        await removeData(`pet_${petId}`);
    } catch (error) {
        console.error('Error removing pet:', error);
    }
};

export const updatePet = async (petId: string, updateCallback: (pet: any) => any) => {
    try {
        const pet = await getPet(petId) || { id: petId, vaccines: [], showers: [] };
        const updatedPet = updateCallback(pet);
        await savePet(updatedPet);
    } catch (error) {
        console.error('Error updating pet:', error);
    }
};

export const addVaccineToPet = async (petId: number, vaccineId: string, date: string) => {
    await updatePet(petId, (pet) => {
        pet.vaccines = pet.vaccines || [];
        pet.vaccines.push({ id: vaccineId, date });
        return pet;
    });
};

export const removeVaccineFromPet = async (petId: number, vaccineId: string) => {
    await updatePet(petId, (pet) => {
        pet.vaccines = pet.vaccines || [];
        pet.vaccines = pet.vaccines.filter((vaccine: any) => vaccine.id !== vaccineId);
        return pet;
    });
};

export const addShowerToPet = async (petId: number, showerId: string, date: string) => {
    await updatePet(petId, (pet) => {
        pet.showers = pet.showers || [];
        pet.showers.push({ id: showerId, date });
        return pet;
    });
};

export const removeShowerFromPet = async (petId: number, showerId: string) => {
    await updatePet(petId, (pet) => {
        pet.showers = pet.showers || [];
        pet.showers = pet.showers.filter((shower: any) => shower.id !== showerId);
        return pet;
    });
};

export const getAllPets = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const petKeys = keys.filter(key => key.startsWith('pet_'));
        const pets = await AsyncStorage.multiGet(petKeys);
        const parsedPets = pets.map(([key, value]) => value ? ({ id: key.replace('pet_', ''), ...JSON.parse(value) }) : null).filter(pet => pet !== null);

        // Debugging: Log the loaded pets
        console.log('Pets loaded:', parsedPets);

        return parsedPets;
    } catch (error) {
        console.error('Error getting all pets:', error);
    }
};

export const addMedicationToPet = async (petId: number, medicationId: string, date: string) => {
    await updatePet(petId, (pet) => {
        pet.medications = pet.medications || [];
        pet.medications.push({ id: medicationId, date });
        return pet;
    });
};

export const removeMedicationFromPet = async (petId: number, medicationId: string) => {
    await updatePet(petId, (pet) => {
        pet.medications = pet.medications || [];
        pet.medications = pet.medications.filter((medication: any) => medication.id !== medicationId);
        return pet;
    });
}

export const getAllMedications = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const medicationKeys = keys.filter(key => key.startsWith('medication_'));
        const medications = await AsyncStorage.multiGet(medicationKeys);
        return medications.map(([key, value]) => value ? ({ id: key.replace('medication_', ''), ...JSON.parse(value) }) : null).filter(medication => medication !== null);
    } catch (error) {
        console.error('Error getting all medications:', error);
    }
};

export const getMedication = async (medicationId: string) => {
    try {
        const value = await getData(`medication_${medicationId}`);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error searching medication:', error);
    }
};

export const saveIconPet = async (petId: number, iconPet: string) => {
    try {
        await saveData(`iconPet_${petId}`, iconPet);
    } catch (error) {
        console.error('Error saving icon pet:', error);
    }
}

export const getIconPet = async (petId: number) => {
    try {
        const value = await getData(`iconPet_${petId}`);
        return value;
    } catch (error) {
        console.error('Error searching icon pet:', error);
    }
};

export const addWalkToPet = async (petId: number, walkId: string, date: string) => {
    await updatePet(petId, (pet) => {
        pet.walks = pet.walks || [];
        pet.walks.push({ id: walkId, date });
        return pet;
    });
};

export const normalizePets = async () => {
    try {
        const pets = await getAllPets();
        const normalizedPets = (pets ?? []).map((pet) => {
            if (typeof pet.id === 'number') {
                // Convert numeric ID to UUID
                const newId = generateUUID();
                const oldId = pet.id;
                pet.id = newId;
                saveData(`pet_${newId}`, JSON.stringify(pet));
                removeData(`pet_${oldId}`);
            }
            return pet;
        });
        return normalizedPets;
    } catch (error) {
        console.error('Error normalizing pets:', error);
    }
};