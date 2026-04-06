import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import api from '../api/api';
import LoadingOverlay from '../components/LoadingOverlay';
import ErrorMessage from '../components/ErrorMessage';

export default function StudentListScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchStudents = async (term = '') => {
    setError('');
    try {
      const res = await api.get('/api/health/all-students', {
        params: { search: term }
      });
      setStudents(res.data);
    } catch (err) {
      console.log('Fetch students error', err.message);
      setError(
        err.response?.data?.message ||
          'Unable to load students. Check network / staff login.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onSearch = () => {
    setLoading(true);
    fetchStudents(search);
  };

  if (loading) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <ErrorMessage message={error} />

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by name or email"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchText}>Go</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.student._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('StudentHealthDetails', {
                studentId: item.student._id
              })
            }
          >
            <Text style={styles.cardTitle}>{item.student.name}</Text>
            <Text style={styles.cardSubtitle}>{item.student.email}</Text>
            <Text style={styles.cardMeta}>
              {item.record ? item.record.bloodGroup : 'No record yet'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#10b981'
  },
  searchText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    elevation: 1
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardSubtitle: { color: '#6b7280', marginTop: 2 },
  cardMeta: { marginTop: 4, color: '#059669' }
});

