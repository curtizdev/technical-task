import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ({ asks, zoom }) {

    const getAskWall = (ask) => {
        if (!asks || asks.length === 0 || !ask.total) return '0%';
        const last_item = asks.length - 1;
        const output = ((ask.total / (asks[last_item].total)) * 100 * zoom).toFixed(0);
        return `${output}%`;
    }

    return (
        <>
            <View style={styles.itemRow}>
                <Text style={styles.text1}>TOTAL</Text>
                <Text style={styles.text2}>PRICE</Text>
            </View>

            {asks && asks.map((ask, i) => (
                <View key={i} style={{ position: 'relative' }}>
                    <View style={styles.itemRow}>
                        <Text style={styles.text1}>{ask.total}</Text>
                        <Text style={styles.text2}>{ask.price}</Text>
                    </View>

                    <View style={styles.buyWall(getAskWall(ask))} />
                </View>
            ))}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 80
    },
    itemRow: {
        backgroundColor: '#112431',
        borderBottomWidth: 1,
        borderBottomColor: '#1d3e54',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        height: 30,
    },
    buyWall: (val) => ({
        backgroundColor: 'red',
        position: 'absolute',
        left: 0,
        width: val, // Ensure width is a valid percentage
        height: '100%',
        opacity: 0.2
    }),
    text1: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc'
    },
    text2: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc'
    },
});