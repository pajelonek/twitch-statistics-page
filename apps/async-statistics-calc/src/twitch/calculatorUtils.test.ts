import { 
    calculateSummaries, 
    calculateStatistics, 
    calculatePeakViewersStrategy, 
    calculateAvgViewersStrategy, 
    calculateWatchHoursStrategy, 
    calculateStreamHoursStrategy, 
    updateSummaries, 
    mergeStreamerStatistics 
} from './calculatorUtils';

describe('Streamer statistics calculations', () => {
    const mockStream1 = {
        id: '1',
        user_id: '123',
        user_login: 'streamer1',
        user_name: 'Streamer One',
        game_id: '001',
        game_name: 'Game One',
        type: 'live',
        viewer_count: 100,
        started_at: new Date('2024-09-01T10:00:00Z'),
        timeStamp: new Date('2024-09-01T12:00:00Z'),
        language: 'en',
        title: 'Stream Title 1',
        thumbnail_url: 'http://thumbnail.url',
        tag_ids: [],
        tags: [],
        is_mature: false
    };
    
    const mockStream2 = {
        id: '2',
        user_id: '123',
        user_login: 'streamer1',
        user_name: 'Streamer One',
        game_id: '001',
        game_name: 'Game One',
        type: 'live',
        viewer_count: 200,
        started_at: new Date('2024-09-01T10:00:00Z'),
        timeStamp: new Date('2024-09-01T14:00:00Z'),
        language: 'en',
        title: 'Stream Title 2',
        thumbnail_url: 'http://thumbnail.url',        
        tag_ids: [],
        tags: [],
        is_mature: false
    };
    
    const mockStream3 = {
        id: '3',
        user_id: '456',
        user_login: 'streamer2',
        user_name: 'Streamer Two',
        game_id: '002',
        game_name: 'Game Two',
        type: 'live',
        viewer_count: 300,
        started_at: new Date('2024-09-01T15:00:00Z'),
        timeStamp: new Date('2024-09-01T17:00:00Z'),
        language: 'en',
        title: 'Stream Title 3',
        thumbnail_url: 'http://thumbnail.url',
        tag_ids: [],
        tags: [],
        is_mature: false
    };

    const streamMap = {
        '123': [mockStream1, mockStream2],
        '456': [mockStream3]
    };

    describe('calculateSummaries', () => {
        it('should return summaries sorted by watchHours', () => {
            const result = calculateSummaries(streamMap);
            expect(result.length).toBe(2);
            expect(result[0].statistics.watchHours).toBeGreaterThan(result[1].statistics.watchHours);
        });
    });

    describe('calculateStatistics', () => {
        it('should calculate statistics correctly for given streams', () => {
            const stats = calculateStatistics([mockStream1, mockStream2]);
            expect(stats.watchHours).toBe(500);
            expect(stats.avgViewers).toBe(150);
            expect(stats.peakViewers).toBe(200);
            expect(stats.streamedHours).toBe(4);
        });
    });

    describe('Strategy functions', () => {
        it('calculatePeakViewersStrategy should return correct peak viewer count', () => {
            const peakViewers = calculatePeakViewersStrategy(150, 100);
            expect(peakViewers).toBe(150);
        });

        it('calculateAvgViewersStrategy should return correct average viewers', () => {
            const avgViewers = calculateAvgViewersStrategy(mockStream2, mockStream1, 100, 2);
            expect(avgViewers).toBe(150);
        });

        it('calculateWatchHoursStrategy should return correct watch hours', () => {
            const watchHours = calculateWatchHoursStrategy(mockStream2, mockStream1);
            expect(watchHours).toBe(300);
        });

        it('calculateStreamHoursStrategy should return correct streamed hours', () => {
            const streamedHours = calculateStreamHoursStrategy(mockStream2, mockStream1);
            expect(streamedHours).toBe(2);
        });
    });

    describe('updateSummaries', () => {
        const existingSummary = {
            streamerId: '123',
            streamerLogin: 'streamer1',
            streamerName: 'Streamer One',
            statistics: {
                watchHours: 100,
                avgViewers: 150,
                peakViewers: 200,
                streamedHours: 5
            }
        };

        const newSummary = {
            streamerId: '123',
            streamerLogin: 'streamer1',
            streamerName: 'Streamer One',
            statistics: {
                watchHours: 50,
                avgViewers: 200,
                peakViewers: 300,
                streamedHours: 3
            }
        };

        it('should merge new summaries with existing ones correctly', () => {
            const updatedSummaries = updateSummaries([existingSummary], [newSummary]);
            expect(updatedSummaries.length).toBe(1);
            const mergedSummary = updatedSummaries[0].statistics;
            expect(mergedSummary.peakViewers).toBe(300);
            expect(mergedSummary.watchHours).toBe(150); // 100 + 50
            expect(mergedSummary.streamedHours).toBe(8); // 5 + 3
            expect(mergedSummary.avgViewers).toBeGreaterThan(150); // Avg recalculation
        });

        it('should add new summaries if streamer does not exist', () => {
            const newSummary = {
                streamerId: '456',
                streamerLogin: 'streamer2',
                streamerName: 'Streamer Two',
                statistics: {
                    watchHours: 200,
                    avgViewers: 250,
                    peakViewers: 300,
                    streamedHours: 4
                }
            };

            const updatedSummaries = updateSummaries([existingSummary], [newSummary]);
            expect(updatedSummaries.length).toBe(2);
            expect(updatedSummaries[1].streamerId).toBe('456');
        });
    });

    describe('mergeStreamerStatistics', () => {
        it('should merge statistics correctly', () => {
            const existingStats = {
                streamerId: '123',
                streamerLogin: 'streamer1',
                streamerName: 'Streamer One',
                statistics: {
                    watchHours: 10,
                    avgViewers: 100,
                    peakViewers: 200,
                    streamedHours: 2
                }
            };

            const newStats = {
                streamerId: '123',
                streamerLogin: 'streamer1',
                streamerName: 'Streamer One',
                statistics: {
                    watchHours: 5,
                    avgViewers: 150,
                    peakViewers: 250,
                    streamedHours: 1
                }
            };

            const mergedStats = mergeStreamerStatistics(existingStats, newStats).statistics;
            expect(mergedStats.peakViewers).toBe(250);
            expect(mergedStats.watchHours).toBe(15);
            expect(mergedStats.streamedHours).toBe(3);
            expect(mergedStats.avgViewers).toBe(112.5);
        });
    });
});
