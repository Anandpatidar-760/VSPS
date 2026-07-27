import React from "react";
import { View, Text } from "react-native";
import { SectionTitle } from "../components/common/SectionTitle";
import { news } from "../constants/mockData";
import { styles } from "../styles/styles";

export function NewsScreen() {
  return (
    <View>
      <SectionTitle title="News & Blogs" />
      {news.map((item) => (
        <View key={item.id} style={styles.newsCard}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
          <Text style={styles.linkText}>Read update</Text>
        </View>
      ))}
    </View>
  );
}
