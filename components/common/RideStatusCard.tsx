import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Driver, Ride, RideStatus } from '../../types';
import Button from './Button';

interface RideStatusCardProps {
  ride: Ride;
  nearbyDrivers?: Driver[];
  onDriverSelect?: (driver: Driver) => void;
  onStatusUpdate?: (status: RideStatus) => void;
  onRefreshDrivers?: () => void;
  isDriver?: boolean;
}

export const RideStatusCard: React.FC<RideStatusCardProps> = ({
  ride,
  nearbyDrivers,
  onDriverSelect,
  onStatusUpdate,
  onRefreshDrivers,
  isDriver = false,
}) => {
  console.log('RideStatusCard nearbyDrivers:', nearbyDrivers);

  const renderDriverList = () => {
    if (!nearbyDrivers || !onDriverSelect) return null;

    return (
      <View style={styles.driverList}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Drivers</Text>
          {onRefreshDrivers && (
            <TouchableOpacity
              onPress={onRefreshDrivers}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          )}
        </View>
        {nearbyDrivers.length === 0 ? (
          <Text style={styles.noDriversText}>No drivers available nearby</Text>
        ) : (
          nearbyDrivers.map((driver) => (
            <TouchableOpacity
              key={driver.id}
              style={styles.driverItem}
              onPress={() => onDriverSelect(driver)}
            >
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.vehicleInfo}>
                  {driver.vehicle.make} {driver.vehicle.model} -{' '}
                  {driver.vehicle.plateNumber}
                </Text>
                <Text style={styles.rating}>
                  Rating: {driver.rating.toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  const renderDriverActions = () => {
    if (!isDriver || !onStatusUpdate) return null;

    switch (ride.status) {
      case 'driver_assigned':
        return (
          <View style={styles.actionButtons}>
            <Button
              text="Start Ride"
              onPress={() => onStatusUpdate('in_progress')}
              variant="primary"
            />
            <Button
              text="Cancel"
              onPress={() => onStatusUpdate('cancelled')}
              variant="outline"
            />
          </View>
        );
      case 'in_progress':
        return (
          <View style={styles.actionButtons}>
            <Button
              text="Pause Ride"
              onPress={() => onStatusUpdate('paused')}
              variant="primary"
            />
            <Button
              text="Complete"
              onPress={() => onStatusUpdate('completed')}
              variant="primary"
            />
          </View>
        );
      case 'paused':
        return (
          <Button
            text="Resume Ride"
            onPress={() => onStatusUpdate('in_progress')}
            variant="primary"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.status}>Status: {ride.status}</Text>
        <Text style={styles.fare}>Fare: ${ride.fare.toFixed(2)}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.location}>
          From: {ride.pickup.address || 'Loading...'}
        </Text>
        <Text style={styles.location}>
          To: {ride.destination.address || 'Loading...'}
        </Text>
        <Text style={styles.tripInfo}>
          Distance: {ride.distance.toFixed(1)} km • Duration:{' '}
          {Math.round(ride.duration)} min
        </Text>
      </View>

      {renderDriverList()}
      {renderDriverActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  fare: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    marginBottom: 8,
  },
  tripInfo: {
    fontSize: 14,
    color: '#666',
  },
  driverList: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#666',
  },
  noDriversText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  driverItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
