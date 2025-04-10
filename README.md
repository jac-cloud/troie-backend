# T.R.O.I.E. Backend

## Installation

To install dependencies:

```sh
bun install
```

To set up and run the project using Docker:

1. Ensure Docker is installed on your machine.
2. Create a `.env` file in the root directory and add the necessary environment variables.
3. Run the following command to start the services:

```sh
docker-compose up
```

## Running the Project

To run:

```sh
bun run dev
```

open http://localhost:3000

## Stack Details

The stack used in this project includes:

- **Bun**: A fast all-in-one JavaScript runtime.
- **Hono**: A small, simple, and ultrafast web framework for the edge.
- **Prisma**: An open-source database toolkit.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **AWS IoT**: A managed cloud service that lets connected devices easily and securely interact with cloud applications and other devices.
- **Zod**: A TypeScript-first schema declaration and validation library.

## API Documentation

### Devices

#### Get Devices

**Endpoint**: `GET /devices`

**Response**:
```json
[
  {
    "deviceId": "string",
    "deviceName": "string | null"
  }
]
```

### Alarms

#### Get Device Alarms

**Endpoint**: `GET /alarms/:deviceId`

**Params**:
- `deviceId`: string

**Response**:
```json
[
  {
    "id": "string",
    "deviceId": "string",
    "threshold": "number",
    "operator": "string"
  }
]
```

#### Create Device Alarm

**Endpoint**: `POST /alarms/:deviceId`

**Params**:
- `deviceId`: string

**Body**:
```json
{
  "threshold": "number",
  "operator": "string"
}
```

**Response**:
```json
{
  "id": "string",
  "deviceId": "string",
  "threshold": "number",
  "operator": "string"
}
```

#### Delete Device Alarm

**Endpoint**: `DELETE /alarms/:deviceId/:alarmId`

**Params**:
- `deviceId`: string
- `alarmId`: string

**Response**:
```json
{
  "message": "string"
}
```

### Sensor Data

#### Get Sensor Data

**Endpoint**: `GET /data/:deviceId`

**Params**:
- `deviceId`: string

**Query**:
- `startDate`: string (date)
- `endDate`: string (date)
- `points`: number (optional)

**Response**:
```json
[
  {
    "deviceId": "string",
    "timestamp": "string",
    "temperature": "number",
    "humidity": "number",
    "alert": "boolean"
  }
]
```

#### Get Sensor Stats

**Endpoint**: `GET /data/:deviceId/stats`

**Params**:
- `deviceId`: string

**Query**:
- `startDate`: string (date)
- `endDate`: string (date)
- `points`: number (optional)

**Response**:
```json
[
  {
    "deviceId": "string",
    "timestamp": "string",
    "freeRam": "number",
    "totalRam": "number"
  }
]
```
