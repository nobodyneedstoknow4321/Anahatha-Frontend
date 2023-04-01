import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
const Comments = ({ route }) => {
  const user = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [doc, setDoc] = useState("Patient");
  useEffect(() => {
    if (user.doctor === true) {
      setDoc("Doctor");
    } else {
      setDoc("Patient");
    }
  });
  const { postId } = route.params;

  useEffect(() => {
    fetch(`https://6658-183-82-176-80.in.ngrok.io/post/${postId}/comment`)
      .then((response) => response.json())
      .then((data) => setComments(data.data))
      .catch((error) => console.error(error));
  }, [postId]);
  const addComment = async () => {
    if (!newComment) {
      alert("Null Comments Cant be posted");
    } else {
      try {
        const response = await axios.post(
          `https://6658-183-82-176-80.in.ngrok.io/post/${postId}/comment`,
          {
            name: user.name,
            role: doc,
            body: newComment,
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="arrow-back-circle-outline"
        style={styles.icon}
        size={30}
      />
      <FlatList
        data={comments}
        keyExtractor={(comment) => comment[0]}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.author}>{item[1]}</Text>
            <Text>{item[3]}</Text>
            {user.doctor && (
              <Text style={styles.verified}>Verified by doctor</Text>
            )}
          </View>
        )}
      />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by ID"
          onChangeText={(text) => setNewComment(text)}
          value={newComment}
        />
        <TouchableOpacity onPress={addComment}>
          <Ionicons style={styles.icon2} name="arrow-redo-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 50,
    backgroundColor: "#fff",
  },
  comment: {
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    fontWeight: "bold",
  },
  icon: {
    marginTop: 5,
    marginBottom: 5,
  },
  searchBar: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchContainer: {
    width: 300,

    paddingHorizontal: 20,
    height: 40,
    flex: 0,
    flexDirection: "row",
  },
  icon2: {
    position: "absolute",
    right: 0,
    marginTop: 20,
    marginRight: -30,
  },
  verified: {
    color: "green",
    fontStyle: "italic",
    marginTop: 8,
  },
});
