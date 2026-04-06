import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 🛑 INSERT YOUR GOOGLE AI STUDIO API KEY HERE 🛑
const AI_STUDIO_API_KEY = "YOUR_API_KEY_HERE";

const Stack = createNativeStackNavigator();

// --- 1. HOME SCREEN (List of Students) ---
function HomeScreen({ navigation }) {
  const [students, setStudents] = useState([]);

  // Load data every time we visit this screen
  useFocusEffect(
    React.useCallback(() => {
      loadStudents();
    },[])
  );

  const loadStudents = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@students_data');
      if (jsonValue != null) {
        setStudents(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Details', { student: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.bloodBadge}><Text style={styles.bloodText}>{item.bloodGroup}</Text></View>
      </View>
      <Text style={styles.cardSub}>Age: {item.age} | Health: {item.conditions}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {students.length === 0 ? (
        <View style={styles.center}><Text>No records found. Add a student!</Text></View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('Add Record')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- 2. ADD RECORD SCREEN (Data Entry) ---
function AddRecordScreen({ navigation }) {
  const[name, setName] = useState('');
  const [age, setAge] = useState('');
  const[bloodGroup, setBloodGroup] = useState('');
  const [conditions, setConditions] = useState('');
  const[notes, setNotes] = useState('');

  const saveRecord = async () => {
    if (!name) {
      Alert.alert("Error", "Please enter at least the student's name");
      return;
    }

    const newStudent = {
      id: Date.now().toString(), // Generates a unique ID
      name, age, bloodGroup, conditions, notes
    };

    try {
      const existingData = await AsyncStorage.getItem('@students_data');
      let studentsArray = existingData ? JSON.parse(existingData) :[];
      studentsArray.push(newStudent);
      
      await AsyncStorage.setItem('@students_data', JSON.stringify(studentsArray));
      navigation.goBack();
    } catch (e) {
      console.error("Failed to save data", e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>Student Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" />

      <Text style={styles.label}>Age</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="12" />

      <Text style={styles.label}>Blood Group</Text>
      <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} placeholder="O+" />

      <Text style={styles.label}>Medical Conditions</Text>
      <TextInput style={styles.input} value={conditions} onChangeText={setConditions} placeholder="E.g., Asthma, Peanut Allergy" />

      <Text style={styles.label}>Additional Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Emergency contact info..." multiline />

      <TouchableOpacity style={styles.button} onPress={saveRecord}>
        <Text style={styles.buttonText}>Save Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- 3. DETAIL SCREEN (With AI Studio Integration) ---
function DetailScreen({ route }) {
  const { student } = route.params;
  const [aiResponse, setAiResponse] = useState("");
  const[loading, setLoading] = useState(false);

  const getAIInsights = async () => {
    if (AI_STUDIO_API_KEY === "YOUR_API_KEY_HERE") {
      Alert.alert("Missing API Key", "Please add your Google AI Studio API key in App.js");
      return;
    }

    setLoading(true);
    setAiResponse("");

    try {
      const genAI = new GoogleGenerativeAI(AI_STUDIO_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are a school health and safety advisor. Analyze the following student health record and provide 3 short, practical precautions for teachers who supervise this student.
        Name: ${student.name}
        Age: ${student.age}
        Blood Group: ${student.bloodGroup}
        Conditions: ${student.conditions}
        Notes: ${student.notes}
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      setAiResponse(responseText);
    } catch (error) {
      console.error(error);
      setAiResponse("Failed to connect to Google AI. Ensure your API key is correct and you have internet access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.infoBox}>
        <Text style={styles.detailText}><Text style={styles.bold}>Name:</Text> {student.name}</Text>
        <Text style={styles.detailText}><Text style={styles.bold}>Age:</Text> {student.age}</Text>
        <Text style={styles.detailText}><Text style={styles.bold}>Blood Group:</Text> {student.bloodGroup}</Text>
        <Text style={styles.detailText}><Text style={styles.bold}>Conditions:</Text> {student.conditions}</Text>
        <Text style={styles.detailText}><Text style={styles.bold}>Notes:</Text> {student.notes}</Text>
      </View>

      <TouchableOpacity style={styles.aiButton} onPress={getAIInsights} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🤖 Get AI Health Insights</Text>}
      </TouchableOpacity>

      {aiResponse !== "" && (
        <View style={styles.aiBox}>
          <Text style={styles.aiTitle}>AI Safety Advisory</Text>
          <Text style={styles.aiText}>{aiResponse}</Text>
        </View>
      )}
    </ScrollView>
  );
}

// --- APP NAVIGATION ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#008080' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Health Records" component={HomeScreen} />
        <Stack.Screen name="Add Record" component={AddRecordScreen} />
        <Stack.Screen name="Details" component={DetailScreen} options={({ route }) => ({ title: route.params.student.name })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  bloodBadge: { backgroundColor: '#ff4c4c', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  bloodText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  cardSub: { fontSize: 14, color: '#666' },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#008080', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabIcon: { color: '#fff', fontSize: 32, fontWeight: '300', marginTop: -4 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#008080', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  aiButton: { backgroundColor: '#6200ee', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  infoBox: { backgroundColor: '#fff', padding: 16, borderRadius: 8, elevation: 1 },
  detailText: { fontSize: 16, marginBottom: 8, color: '#444' },
  bold: { fontWeight: 'bold', color: '#000' },
  aiBox: { backgroundColor: '#e0f2f1', padding: 16, borderRadius: 8, marginTop: 20, borderWidth: 1, borderColor: '#008080' },
  aiTitle: { fontSize: 16, fontWeight: 'bold', color: '#008080', marginBottom: 8 },
  aiText: { fontSize: 15, color: '#333', lineHeight: 22 },
});
