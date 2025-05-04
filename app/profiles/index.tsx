import Bar from '@/components/ui/Bar';
import { catIcons, dogIcons } from '@/lib/iconPaths';
import { Pet, getAllPets, getPet, removePet, savePet, updatePet } from '@/lib/storage/storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

const IconSelectionModal = ({ isVisible, onClose, onSelectIcon }: { isVisible: boolean; onClose: () => void; onSelectIcon: (icon: any) => void }) => {
    const icons = [...dogIcons, ...catIcons];

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View className=" bg-white rounded-lg p-5" style={{ height: '40%', width: '90%', alignSelf: 'center' }}>
                <FlatList
                    data={icons}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={4}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => { onSelectIcon(item); onClose();}} style={{ margin: 14, }}>
                            <Image source={item} className="w-12 h-12 bg-white rounded-lg shadow-sm shadow-black" />
                        </TouchableOpacity>
                    )}
                />
                <TouchableOpacity className="absolute top-2 right-2" onPress={onClose}>
                    <Text className="text-gray-600 font-bold p-1">X</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const Profiles = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isIconModalVisible, setIconModalVisible] = useState(false);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);

    useEffect(() => {
        const fetchPets = async () => {
            const allPets = await getAllPets();
            setPets(allPets || []);
        };
        fetchPets();
    }, []);

    const handleAddOrEditPet = async (petId: number | null, petData: any) => {
        if (petId === null) {
            const newPet = await savePet(petData);
            const updatedPet = { ...newPet, id: Number(newPet.id), castration: petData.castration || false };
            setPets((prevPets) => [...prevPets, updatedPet]);
            setEditingPet(updatedPet); // Atualiza o estado do pet para o novo pet salvo
        } else {
            await updatePet(petId.toString(), (existingPet) => ({ ...existingPet, ...petData }));
            setPets((prevPets) => prevPets.map((pet) => (pet.id === petId ? { ...pet, ...petData, castration: petData.castration || pet.castration } : pet)));
        }
    };

    const openModalForPet = (petId: number | null) => {
        if (petId === null) {
            // Open modal for creating a new pet
            setModalVisible(true);
            setEditingPet({
                name: '',
                type: 'unknown',
                weight: 0,
                age: 0,
                gender: 'unknown',
                castration: false,
                icon: null,
            });
        } else {
            getPet(petId.toString()).then((pet) => { 
                setEditingPet(pet);
                setModalVisible(true);
            });
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleIconSelect = async (icon: any, petId: number | null) => {
        if (petId !== null) {
            await updatePet(petId.toString(), (pet) => ({ ...pet, icon }));
            setPets((prevPets) =>
                prevPets.map((pet) =>
                    pet.id === petId ? { ...pet, icon } : pet
                )
            );
            setEditingPet((prev) => (prev ? { ...prev, icon } : null));
        }
    };

    const openIconModalForPet = (petId: number | null) => {
        if (petId !== null) {
            setEditingPet(pets.find((pet) => pet.id === petId) || null);
            setIconModalVisible(true);
        }
    };

    return (
        <View className="flex-1 bg-purple-900">
            <Bar title='My Pets' />
            <View className="absolute top-[12%] left-[6%] w-[88%] h-[85%] bg-white rounded-lg shadow-md flex flex-col items-center">
                <FlatList
                    className='w-full h-full'
                    data={pets}
                    renderItem={({ item }) => (
                        <View className="w-full self-center bg-purple-100 rounded-lg justify-center items-center shadow-md shadow-black mb-4 p-4">
                            <View className='flex flex-row w-14 h-12 mb-2 left-4 absolute rounded-full justify-center items-center' style={{ top: '50%', transform: [{ translateY: -10 }] }}>
                                <TouchableOpacity onPress={() => openIconModalForPet(item.id ?? null)}>
                                    {item.icon ? (
                                        <Image source={typeof item.icon === 'string' ? { uri: item.icon } : item.icon} className="w-12 h-12" />
                                    ) : (
                                        <Image source={require('@/assets/icons/default_icon.png')} className="w-12 h-12" />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View className='flex flex-col gap-8' style={{ marginLeft: 50 }}>
                                <Text className="font-bold text-black">{item.name}</Text>
                                <View className='flex flex-row items-center gap-2'>
                                    <Text className="text-gray-600 text-sm">{`${item.age}`} anos</Text>
                                    <View className='w-0.5 h-5 bg-gray-300' />
                                    <Text className="text-gray-600 text-sm">{`${item.weight}`}kg</Text>
                                    <View className='w-0.5 h-5 bg-gray-300' />
                                    {item.castration ? (
                                        <Text className="text-gray-600 text-sm">{`Castration: Y`}</Text>
                                    ) : (
                                        <Text className="text-gray-600 text-sm">{`Castration: N`}</Text>
                                    )}
                                    <View className='w-0.5 h-5 bg-gray-300' />
                                    {item.gender == 'female' ? (
                                        <Image source={require('@/assets/images/profiles/female_gender.png')} style={{ width: 16, height: 16 }} />
                                    ) : (
                                        <Image source={require('@/assets/images/profiles/male_gender.png')} style={{ width: 16, height: 16 }} />
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity className="absolute top-2 right-2 rounded-full bg-purple-100 shadow-sm p-1 shadow-black " onPress={() => openModalForPet(item.id ?? null)}>
                                <Image source={require('@/assets/images/profiles/pencil.png')} className="w-6 h-6" />
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.id?.toString() || ''}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
                />
                <TouchableOpacity
                    className="bg-purple-900 rounded-full p-3 shadow-md shadow-black absolute bottom-5 right-5"
                    style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => openModalForPet(null)}
                >
                    <Text className="text-white font-bold text-xl">+</Text>
                </TouchableOpacity>
            </View>
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} >
                <View className="w-[80%] h-[75%] bg-white rounded-lg p-5 flex flex-col justify-start items-center mx-auto my-auto gap-6">
                    <Text className="text-xl font-fredokaBold text-purple-900">{editingPet?.id ? 'Edit Pet Details' : 'Add New Pet'}</Text>
                    <TouchableOpacity
                        onPress={() => setIconModalVisible(true)}
                        style={{ marginBottom: 20 }}
                    >
                        <Image
                            source={editingPet?.icon || require('@/assets/icons/default_icon.png')}
                            className="w-12 h-12 bg-white rounded-lg shadow-sm shadow-black"
                        />
                    </TouchableOpacity>
                    {isIconModalVisible && (
                        <FlatList
                            data={[...dogIcons, ...catIcons]}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={4}
                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingPet((prev) => prev ? { ...prev, icon: item } : null);
                                        setIconModalVisible(false);
                                    }}
                                    style={{ margin: 14 }}
                                >
                                    <Image
                                        source={item}
                                        className={`w-12 h-12 bg-white rounded-lg shadow-sm shadow-black ${editingPet?.icon === item ? 'border-2 border-purple-900' : ''}`}
                                    />
                                </TouchableOpacity>
                            )}
                            style={{ maxHeight: '50%' }} // Limita a altura para permitir o scroll
                        />
                    )}
                    <TextInput
                        className="w-full h-10 border-b border-gray-300"
                        placeholder="Pet Name"
                        value={editingPet?.name || ''}
                        onChangeText={(text) => setEditingPet((prev) => prev ? { ...prev, name: text } : null)}
                    />
                    <TextInput
                        className="w-full h-10 border-b border-gray-300"
                        placeholder="Pet Weight"
                        keyboardType="numeric"
                        value={editingPet?.weight?.toString() || ''}
                        onChangeText={(text) => {
                            const parsedWeight = parseFloat(text);
                            setEditingPet((prev) => prev ? { ...prev, weight: isNaN(parsedWeight) ? 0 : parsedWeight } : null);
                        }}
                    />
                    <TextInput
                        className="w-full h-10 border-b border-gray-300"
                        placeholder="Pet Age"
                        keyboardType="numeric"
                        value={editingPet?.age?.toString() || ''}
                        onChangeText={(text) => {
                            const parsedAge = parseInt(text, 10);
                            setEditingPet((prev) => prev ? { ...prev, age: isNaN(parsedAge) ? 0 : parsedAge } : null);
                        }}
                    />
                    <Picker
                        style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 }}
                        selectedValue={editingPet?.gender || 'unknown'}
                        onValueChange={(value) => setEditingPet((prev) => prev ? { ...prev, gender: value } : null)}
                    >
                        <Picker.Item label="Select Gender" value="unknown" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                    <Picker
                        style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 }}
                        selectedValue={editingPet?.type || 'dog'}
                        onValueChange={(value) => setEditingPet((prev) => prev ? { ...prev, type: value } : null)}
                    >
                        <Picker.Item label="Dog" value="dog" />
                        <Picker.Item label="Cat" value="cat" />
                    </Picker>
                    <Picker
                        style={{ width: '100%', height: 60, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 }}
                        selectedValue={editingPet?.castration ? 'true' : 'false'}
                        onValueChange={(value) => setEditingPet((prev) => prev ? { ...prev, castration: value === 'true' } : null)}
                    >
                        <Picker.Item label="Castrated" value="true" />
                        <Picker.Item label="Not Castrated" value="false" />
                    </Picker>
                    <View className="absolute bottom-5 flex flex-row w-full justify-around items-center">
                        <TouchableOpacity
                            className="bg-gray-400 rounded-lg p-3"
                            onPress={toggleModal}
                        >
                            <Text className="text-white font-bold">Cancel</Text>
                        </TouchableOpacity>
                        {editingPet?.id ? (
                            <>
                                <TouchableOpacity
                                    className="bg-red-700 rounded-lg p-3"
                                    onPress={async () => {
                                        if (editingPet?.id) {
                                            await removePet(editingPet.id.toString());
                                            setPets((prevPets) => prevPets.filter((pet) => pet.id !== editingPet.id));
                                        }
                                        toggleModal();
                                    }}
                                >
                                    <Text className="text-white font-bold">Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-purple-900 rounded-lg p-3"
                                    onPress={async () => {
                                        if (editingPet) {
                                            await handleAddOrEditPet(editingPet.id || null, editingPet);
                                        }
                                        toggleModal();
                                    }}
                                >
                                    <Text className="text-white font-bold">Save</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                className="bg-purple-900 rounded-lg p-3"
                                onPress={async () => {
                                    if (editingPet) {
                                        await handleAddOrEditPet(null, editingPet);
                                    }
                                    toggleModal();
                                }}
                            >
                                <Text className="text-white font-bold">Add Pet</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
            <IconSelectionModal
                isVisible={isIconModalVisible}
                onClose={() => setIconModalVisible(false)}
                onSelectIcon={(icon) => handleIconSelect(icon, editingPet?.id || null)}
            />
        </View>
    );
};

export default Profiles;