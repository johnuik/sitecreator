import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "../components";
import {
  Crm,
  Dashboard,
  Ecomerce,
  Cryptocracy,
  Investment,
  Lms,
  Nft,
  Medical,
  Analytics,
  Email,
  Chat,
  Calendar, Kanban,
  InvoiceList, InvoicePreview,
  InvoiceAdd,
  InvoiceEdit,
  TextGenerator,
  CodeGenerator,
  ImageGenerator,
  VoiceGenerator,
  VideoGenerator,
  Wallet,
  Typography,
  Colors,
  Button,
  Dropdown,
  Alert,
  Card,
  Carousel,
  Avatar,
  Progress,
  Tabs,
  Pagination,
  Badges,
  Tooltip,
  Videos,
  StarRating,
  Tags,
  List,
  Radio,
  Switch,
  ImageUpload,
  Form,
  FormLayout,
  FormValidation,
  Wizard,
  BasicTable,
  DataTable,
  LineChart,
  ColumnChart,
  PieChart,
  Widgets,
  UsersList,
  UsersGrid,
  AddUser,
  ViewProfile,
  SignIn,
  SignUp,
  ForgotPassword,
  Gallery,
  Error,
  Faq,
  Pricing,
  TermsCondition,
  Company,
  Notification,
  NotificationAlert,
  Theme,
  Currencies,
  Language,
  PaymentGateway,
  New
} from "../pages"


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Main />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crm" element={<Crm />} />
          <Route path="/ecomerce" element={<Ecomerce />} />
          <Route path="/cryptocracy" element={<Cryptocracy />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/lms" element={<Lms />} />
          <Route path="/nft" element={<Nft />} />
          <Route path="/medical" element={<Medical />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/email" element={<Email />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/invoice-list" element={<InvoiceList />} />
          <Route path="/invoice-preview" element={<InvoicePreview />} />
          <Route path="/invoice-add" element={<InvoiceAdd />} />
          <Route path="/invoice-edit" element={<InvoiceEdit />} />
          <Route path="/text-generator" element={<TextGenerator />} />
          <Route path="/code-generator" element={<CodeGenerator />} />
          <Route path="/image-generator" element={<ImageGenerator />} />
          <Route path="/voice-generator" element={<VoiceGenerator />} />
          <Route path="/video-generator" element={<VideoGenerator />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/typography" element={<Typography />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/button" element={<Button />} />
          <Route path="/dropdown" element={<Dropdown />} />
          <Route path="/alert" element={<Alert />} />
          <Route path="/card" element={<Card />} />
          <Route path="/carousel" element={<Carousel />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/tabs" element={<Tabs />} />
          <Route path="/pagination" element={<Pagination />} /> 
          <Route path="/badges" element={<Badges />} />
          <Route path="/tooltip" element={<Tooltip />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/star-rating" element={<StarRating />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/list" element={<List />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/switch" element={<Switch />} />
          <Route path="/image-upload" element={<ImageUpload />} />
          <Route path="/form" element={<Form />} />
          <Route path="/form-layout" element={<FormLayout />} />
          <Route path="/form-validation" element={<FormValidation />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/table-basic" element={<BasicTable />} />
          <Route path="/table-data" element={<DataTable />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="column-chart" element={<ColumnChart />} />
          <Route path="pie-chart" element={<PieChart />} />
          <Route path="/widgets" element={<Widgets />} />
          <Route path="/users-list" element={<UsersList />} />
          <Route path="/users-grid" element={<UsersGrid />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/view-profile" element={<ViewProfile />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/gallery" element={<Gallery/>} />
          <Route path="/pricing" element={<Pricing/>} />
          <Route path="/faq" element={<Faq/>} />
          <Route path="/error" element={<Error/>} />
          <Route path="/terms-condition" element={<TermsCondition/>} />
          <Route path="/company" element={<Company/>} />
          <Route path="/notification" element={<Notification/>} />
          <Route path="/notification-alert" element={<NotificationAlert/>} />
          <Route path="/theme" element={<Theme/>} />
          <Route path="/currencies" element={<Currencies/>} />
          <Route path="/language" element={<Language/>} />
          <Route path="/payment-gateway" element={<PaymentGateway/>} />
          <Route path="/create" element={<New/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;