
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
} = require('./runtime/library')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.5.2
 * Query Engine version: aebc046ce8b88ebbcb45efe31cbe7d06fd6abc0a
 */
Prisma.prismaVersion = {
  client: "5.5.2",
  engine: "aebc046ce8b88ebbcb45efe31cbe7d06fd6abc0a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}


  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.VehicleScalarFieldEnum = {
  id: 'id',
  license: 'license',
  brand: 'brand',
  model: 'model',
  color: 'color',
  createdAt: 'createdAt'
};

exports.Prisma.ParkingSpaceScalarFieldEnum = {
  id: 'id',
  number: 'number',
  isOccupied: 'isOccupied',
  createdAt: 'createdAt'
};

exports.Prisma.TicketScalarFieldEnum = {
  id: 'id',
  entryTime: 'entryTime',
  exitTime: 'exitTime',
  cost: 'cost',
  vehicleId: 'vehicleId',
  parkingSpaceId: 'parkingSpaceId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  ticketId: 'ticketId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Vehicle: 'Vehicle',
  ParkingSpace: 'ParkingSpace',
  Ticket: 'Ticket',
  Transaction: 'Transaction'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\CoipoNorte\\Desktop\\Estacionamiento-main\\prisma\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.5.2",
  "engineVersion": "aebc046ce8b88ebbcb45efe31cbe7d06fd6abc0a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "Ly8gc2NoZW1hLnByaXNtYQpnZW5lcmF0b3IgY2xpZW50IHsKICBwcm92aWRlciA9ICJwcmlzbWEtY2xpZW50LWpzIgogIG91dHB1dCAgID0gIi4vZ2VuZXJhdGVkL2NsaWVudCIKfQoKZGF0YXNvdXJjZSBkYiB7CiAgcHJvdmlkZXIgPSAicG9zdGdyZXNxbCIKICB1cmwgICAgICA9IGVudigiREFUQUJBU0VfVVJMIikKfQoKLy8gRGVmaW5pY2nDs24gZGVsIG1vZGVsbyBWZWhpY2xlCm1vZGVsIFZlaGljbGUgewogIGlkICAgICAgICBJbnQgICAgICBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKSAvLyBJZGVudGlmaWNhZG9yIMO6bmljbyBkZWwgdmVow61jdWxvCiAgbGljZW5zZSAgIFN0cmluZyAgIEB1bmlxdWUgLy8gTsO6bWVybyBkZSBtYXRyw61jdWxhIGRlbCB2ZWjDrWN1bG8gKGRlYmUgc2VyIMO6bmljbykKICBicmFuZCAgICAgU3RyaW5nPyAvLyBNYXJjYSBkZWwgdmVow61jdWxvCiAgbW9kZWwgICAgIFN0cmluZz8gLy8gTW9kZWxvIGRlbCB2ZWjDrWN1bG8KICBjb2xvciAgICAgU3RyaW5nPyAvLyBDb2xvciBkZWwgdmVow61jdWxvCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSAvLyBGZWNoYSBkZSBjcmVhY2nDs24gZGVsIHJlZ2lzdHJvIGRlbCB2ZWjDrWN1bG8KCiAgLy8gUmVsYWNpw7NuIGNvbiBlbCB0aWNrZXQgZGUgZXN0YWNpb25hbWllbnRvCiAgdGlja2V0IFRpY2tldFtdIC8vIFVuIHZlaMOtY3VsbyBwdWVkZSB0ZW5lciB2YXJpb3MgdGlja2V0cyBhc29jaWFkb3MKfQoKLy8gRGVmaW5pY2nDs24gZGVsIG1vZGVsbyBQYXJraW5nU3BhY2UKbW9kZWwgUGFya2luZ1NwYWNlIHsKICBpZCAgICAgICAgIEludCAgICAgIEBpZCBAZGVmYXVsdChhdXRvaW5jcmVtZW50KCkpIC8vIElkZW50aWZpY2Fkb3Igw7puaWNvIGRlbCBlc3BhY2lvIGRlIGVzdGFjaW9uYW1pZW50bwogIG51bWJlciAgICAgSW50ICAgICAgQHVuaXF1ZSAvLyBOw7ptZXJvIMO6bmljbyBkZSBlc3BhY2lvIGRlIGVzdGFjaW9uYW1pZW50bwogIGlzT2NjdXBpZWQgQm9vbGVhbiAvLyBJbmRpY2Egc2kgZWwgZXNwYWNpbyBkZSBlc3RhY2lvbmFtaWVudG8gZXN0w6Egb2N1cGFkbyAodHJ1ZSkgbyBsaWJyZSAoZmFsc2UpCiAgY3JlYXRlZEF0ICBEYXRlVGltZSBAZGVmYXVsdChub3coKSkgLy8gRmVjaGEgZGUgY3JlYWNpw7NuIGRlbCByZWdpc3RybyBkZWwgZXNwYWNpbyBkZSBlc3RhY2lvbmFtaWVudG8KCiAgLy8gUmVsYWNpw7NuIGNvbiBlbCB0aWNrZXQgZGUgZXN0YWNpb25hbWllbnRvCiAgdGlja2V0IFRpY2tldFtdIC8vIFVuIGVzcGFjaW8gZGUgZXN0YWNpb25hbWllbnRvIHB1ZWRlIGVzdGFyIGFzb2NpYWRvIGEgdmFyaW9zIHRpY2tldHMKfQoKLy8gRGVmaW5pY2nDs24gZGVsIG1vZGVsbyBUaWNrZXQKbW9kZWwgVGlja2V0IHsKICBpZCAgICAgICAgICAgICBJbnQgICAgICAgQGlkIEBkZWZhdWx0KGF1dG9pbmNyZW1lbnQoKSkgLy8gSWRlbnRpZmljYWRvciDDum5pY28gZGVsIHRpY2tldAogIGVudHJ5VGltZSAgICAgIERhdGVUaW1lICBAZGVmYXVsdChub3coKSkgLy8gRmVjaGEgeSBob3JhIGRlIGVudHJhZGEgZGVsIHZlaMOtY3VsbwogIGV4aXRUaW1lICAgICAgIERhdGVUaW1lPyAvLyBGZWNoYSB5IGhvcmEgZGUgc2FsaWRhIGRlbCB2ZWjDrWN1bG8gKG51bGwgc2kgYcO6biBubyBoYSBzYWxpZG8pCiAgY29zdCAgICAgICAgICAgRmxvYXQ/IC8vIENvc3RvIHRvdGFsIGRlbCBlc3RhY2lvbmFtaWVudG8gKG51bGwgc2kgZWwgdmVow61jdWxvIG5vIGhhIHNhbGlkbykKICB2ZWhpY2xlSWQgICAgICBJbnQgLy8gRWwgSUQgZGVsIHZlaMOtY3VsbyBhc29jaWFkbwogIHBhcmtpbmdTcGFjZUlkIEludCAvLyBFbCBJRCBkZWwgZXNwYWNpbyBkZSBlc3RhY2lvbmFtaWVudG8gYXNvY2lhZG8KICBjcmVhdGVkQXQgICAgICBEYXRlVGltZSAgQGRlZmF1bHQobm93KCkpIC8vIEZlY2hhIGRlIGNyZWFjacOzbiBkZWwgcmVnaXN0cm8gZGVsIHRpY2tldAogIHVwZGF0ZWRBdCAgICAgIERhdGVUaW1lICBAdXBkYXRlZEF0IC8vIEZlY2hhIGRlIMO6bHRpbWEgYWN0dWFsaXphY2nDs24gZGVsIHJlZ2lzdHJvIGRlbCB0aWNrZXQKCiAgLy8gUmVsYWNpb25lcyBjb24gb3Ryb3MgbW9kZWxvcwogIHZlaGljbGUgICAgICBWZWhpY2xlICAgICAgIEByZWxhdGlvbihmaWVsZHM6IFt2ZWhpY2xlSWRdLCByZWZlcmVuY2VzOiBbaWRdKSAvLyBSZWxhY2nDs24gY29uIGVsIHZlaMOtY3VsbwogIHBhcmtpbmdTcGFjZSBQYXJraW5nU3BhY2UgIEByZWxhdGlvbihmaWVsZHM6IFtwYXJraW5nU3BhY2VJZF0sIHJlZmVyZW5jZXM6IFtpZF0pIC8vIFJlbGFjacOzbiBjb24gZWwgZXNwYWNpbyBkZSBlc3RhY2lvbmFtaWVudG8KICBUcmFuc2FjdGlvbiAgVHJhbnNhY3Rpb25bXQp9CgovLyBEZWZpbmljacOzbiBkZWwgbW9kZWxvIFRyYW5zYWN0aW9uIChwYXJhIGVsIHJlZ2lzdHJvIGRlIHRyYW5zYWNjaW9uZXMgbW9uZXRhcmlhcykKbW9kZWwgVHJhbnNhY3Rpb24gewogIGlkICAgICAgICBJbnQgICAgICBAaWQgQGRlZmF1bHQoYXV0b2luY3JlbWVudCgpKSAvLyBJZGVudGlmaWNhZG9yIMO6bmljbyBkZSBsYSB0cmFuc2FjY2nDs24KICBhbW91bnQgICAgRmxvYXQgLy8gTW9udG8gZGUgbGEgdHJhbnNhY2Npw7NuCiAgdGlja2V0SWQgIEludCAvLyBFbCBJRCBkZWwgdGlja2V0IGFzb2NpYWRvIGEgbGEgdHJhbnNhY2Npw7NuCiAgY3JlYXRlZEF0IERhdGVUaW1lIEBkZWZhdWx0KG5vdygpKSAvLyBGZWNoYSBkZSBjcmVhY2nDs24gZGUgbGEgdHJhbnNhY2Npw7NuCgogIC8vIFJlbGFjacOzbiBjb24gZWwgdGlja2V0CiAgdGlja2V0IFRpY2tldCBAcmVsYXRpb24oZmllbGRzOiBbdGlja2V0SWRdLCByZWZlcmVuY2VzOiBbaWRdKQp9Cg==",
  "inlineSchemaHash": "efbaa0871830824b83de11e9dcd3e574ad09b7cd61489e1d30dd4221993e35a2",
  "noEngine": false
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "prisma/generated/client",
    "generated/client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Vehicle\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"license\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brand\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"model\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"color\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticket\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ticket\",\"relationName\":\"TicketToVehicle\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ParkingSpace\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"number\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isOccupied\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticket\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ticket\",\"relationName\":\"ParkingSpaceToTicket\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Ticket\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entryTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"exitTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vehicleId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parkingSpaceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"vehicle\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Vehicle\",\"relationName\":\"TicketToVehicle\",\"relationFromFields\":[\"vehicleId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"parkingSpace\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ParkingSpace\",\"relationName\":\"ParkingSpaceToTicket\",\"relationFromFields\":[\"parkingSpaceId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Transaction\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Transaction\",\"relationName\":\"TicketToTransaction\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Transaction\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticket\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ticket\",\"relationName\":\"TicketToTransaction\",\"relationFromFields\":[\"ticketId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)



const { warnEnvConflicts } = require('./runtime/library')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "prisma/generated/client/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "prisma/generated/client/schema.prisma")
