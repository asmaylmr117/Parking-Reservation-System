# WeLink Cargo Parking Reservation System - Frontend

A comprehensive React.js frontend application for the WeLink Cargo Parking Reservation System, featuring real-time updates, modern UI, and complete parking management functionality.

## 🚀 Features

### Core Functionality
- **Gate Check-in System**: Visitor and subscriber parking reservations
- **Checkpoint Management**: Employee-controlled checkout with rate calculations
- **Admin Dashboard**: Complete system management and reporting
- **Real-time Updates**: WebSocket integration for live zone status updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Roles
- **Visitors**: Can select and reserve available parking zones
- **Subscribers**: Special access with subscription verification and reduced rates
- **Employees**: Can process checkouts and manage checkpoint operations
- **Administrators**: Full system access including zone management, user management, and reporting

## 🛠️ Tech Stack
- **React 18.2.0** - Frontend framework
- **React Router Dom 6.20.1** - Client-side routing
- **React Query 3.39.3** - Server state management and data fetching
- **Zustand 4.4.7** - Global state management
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Lucide React 0.294.0** - Beautiful icons
- **Axios 1.6.2** - HTTP client
- **Date-fns 2.30.0** - Date utility library
- **React Hot Toast 2.4.1** - Toast notifications



### Installation
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd parking-reservation-frontend
   ```
2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```
4. Open your browser and navigate to `http://localhost:3000`

### Backend Setup
Ensure the backend server is running on `http://localhost:3000`. The frontend expects the following endpoints:
- **API Base URL**: `http://localhost:3000/api/v1`
- **WebSocket URL**: `ws://localhost:3000/api/v1/ws`

## 🔐 Demo Users
The application includes pre-configured demo users for testing:

### Administrators
- Username: `admin` | Password: `adminpass`
- Username: `superadmin` | Password: `superpass`

### Employees
- Username: `emp1` | Password: `pass1`
- Username: `emp2` | Password: `pass1`
- Username: `checkpoint1` | Password: `checkpoint1`

### Test Subscriptions
- `sub_001` - Active Premium subscriber (Ali)
- `sub_002` - Active Regular subscriber (Sara)
- `sub_003` - Active VIP subscriber (Ahmed)

## 📱 Application Screens

### 1. Gate Screen (`/gate/:gateId`)
**Purpose**: Primary interface for parking check-ins  
**Features**:
- Real-time zone availability display
- Visitor and subscriber tabs
- Subscription verification
- Zone selection with availability indicators
- Printable ticket generation
- WebSocket live updates

**User Flow**:
1. Select user type (Visitor/Subscriber)
2. For subscribers: Enter and verify subscription ID
3. Choose available zone
4. Complete check-in process
5. Receive printable parking ticket

### 2. Checkpoint Screen (`/checkpoint`)
**Purpose**: Employee interface for processing checkouts  
**Access**: Employees and Administrators only  
**Features**:
- Ticket ID lookup and verification
- Rate breakdown calculations
- Subscription car verification
- Force convert to visitor option
- Payment processing simulation

**User Flow**:
1. Employee login required
2. Scan or enter ticket ID
3. Review parking duration and charges
4. Verify subscriber vehicle (if applicable)
5. Process checkout with payment details

### 3. Admin Dashboard (`/admin`)
**Purpose**: Complete system management interface  
**Access**: Administrators only  
**Sub-pages**:
- **Parking State Report** (`/admin`)
  - Real-time system overview
  - Zone occupancy statistics
  - Subscriber counts and availability
  - System health indicators
- **Employee Management** (`/admin/employees`)
  - Create new employee accounts
  - View all system users
  - Role-based access control
  - User statistics
- **Control Panel** (`/admin/control`)
  - Zone Management: Open/close zones for maintenance
  - Rate Management: Update category pricing
  - Rush Hours: Configure peak hour schedules
  - Vacation Periods: Set special rate periods

## 🔌 Real-time Features

### WebSocket Integration
The application maintains a persistent WebSocket connection for real-time updates:
- **Connection Management**:
  - Automatic connection on gate page load
  - Reconnection attempts with exponential backoff
  - Connection status indicators in UI
- **Message Types**:
  - `zone-update`: Live zone availability changes
  - `admin-update`: Administrative action notifications
- **Implementation**:
  ```javascript
  // Subscribe to gate updates
  websocketService.subscribeToGate(gateId);

  // Handle incoming updates
  useEffect(() => {
    // Updates automatically refresh zone cards
  }, [zones]);
  ```

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue theme with semantic colors
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent 4px grid system
- **Animation**: Smooth transitions and loading states

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and ARIA labels
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablets
- **Desktop Enhancement**: Full feature set on desktop

## 🧪 Testing

### Manual Testing Scenarios
#### Gate Check-in Flow
- Load gate page and verify WebSocket connection
- Test visitor check-in to available zone
- Test subscriber verification and check-in
- Verify ticket modal and printing functionality

#### Checkpoint Processing
- Login as employee
- Lookup active ticket
- Process standard checkout
- Test force convert to visitor option

#### Admin Operations
- Access admin dashboard
- Review parking state report
- Create new employee account
- Toggle zone open/closed status
- Update category rates

### API Integration Testing
```bash
# Test API endpoints
curl http://localhost:3000/api/v1/master/gates
curl http://localhost:3000/api/v1/master/zones?gateId=gate_1
```

## 🚀 Build and Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file for configuration:
```
REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
REACT_APP_WS_URL=ws://localhost:3000/api/v1/ws
```

## 🔧 Development Guidelines

### State Management Strategy
- **React Query**: Server state and API caching
- **Zustand**: Global UI state (auth, WebSocket)
- **Local State**: Component-specific state with useState

### API Integration Pattern
```javascript
// Custom hooks for API calls
const { data, isLoading, error } = useZones(gateId);

// Mutations for server updates  
const checkinMutation = useCheckin();
await checkinMutation.mutateAsync(checkinData);
```

### Error Handling
- Global error interceptors in Axios
- Toast notifications for user feedback
- Graceful degradation for offline scenarios

## 📋 Requirements Compliance

### ✅ Technical Requirements Met
- React.js with functional components and hooks
- React Query for data fetching and caching
- Zustand for state management
- WebSocket real-time updates
- Tailwind CSS for styling
- Responsive design
- No client-side business logic

### ✅ Functional Requirements Met
- Gate check-in (visitor & subscriber flows)
- Checkpoint checkout with rate calculations
- Admin dashboard with all control features
- Authentication and role-based access
- Printable ticket generation
- Real-time zone updates via WebSocket

### ✅ UX Requirements Met
- Loading states and error handling
- Accessible keyboard navigation
- Clean, professional UI design
- Mobile-responsive layout

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper commit messages
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Implementation Notes

### Key Design Decisions
- **Component Architecture**: Modular components with clear separation of concerns
- **State Management**: Zustand for simplicity, React Query for server state
- **Real-time Updates**: WebSocket service with reconnection logic
- **Error Handling**: Centralized with user-friendly messages
- **Performance**: Optimized with React Query caching and lazy loading

### Known Limitations
- WebSocket reconnection limited to 5 attempts
- Print functionality requires browser print dialog
- Offline mode not implemented (planned for future release)

### Future Enhancements
- Progressive Web App (PWA) support
- Dark mode theme
- Advanced reporting dashboard
- Mobile app notifications
- Multi-language support

---

**WeLink Cargo Parking Reservation System**  
Built with ❤️ using React.js, React Query, Zustand, and Tailwind CSS