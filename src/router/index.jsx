import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const Main = lazy(() => import("../components/layouts/main"));

const Crm = lazy(() => import("../pages/dashboard/crm"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const Ecomerce = lazy(() => import("../pages/dashboard/ecomerce"));
const Cryptocracy = lazy(() => import("../pages/dashboard/cryptocracy"));
const Investment = lazy(() => import("../pages/dashboard/investment"));
const Lms = lazy(() => import("../pages/dashboard/lms"));
const Nft = lazy(() => import("../pages/dashboard/nft"));
const Medical = lazy(() => import("../pages/dashboard/medical"));
const Analytics = lazy(() => import("../pages/dashboard/analytics"));
const Email = lazy(() => import("../pages/email"));
const Chat = lazy(() => import("../pages/chat"));
const Calendar = lazy(() => import("../pages/calendar"));
const Kanban = lazy(() => import("../pages/kanban"));
const InvoiceList = lazy(() => import("../pages/invoice/list"));
const InvoicePreview = lazy(() => import("../pages/invoice/preview"));
const InvoiceAdd = lazy(() => import("../pages/invoice/add"));
const InvoiceEdit = lazy(() => import("../pages/invoice/edit"));
const TextGenerator = lazy(() => import("../pages/ai/text-generator"));
const CodeGenerator = lazy(() => import("../pages/ai/code-generator"));
const ImageGenerator = lazy(() => import("../pages/ai/image-generator"));
const VoiceGenerator = lazy(() => import("../pages/ai/voice-generator"));
const VideoGenerator = lazy(() => import("../pages/ai/video-generator"));
const Wallet = lazy(() => import("../pages/wallet"));
const Typography = lazy(() => import("../pages/typography"));
const Colors = lazy(() => import("../pages/colors"));
const Button = lazy(() => import("../pages/button"));
const Dropdown = lazy(() => import("../pages/dropdown"));
const Alert = lazy(() => import("../pages/alert"));
const Card = lazy(() => import("../pages/card"));
const Carousel = lazy(() => import("../pages/carousel"));
const Avatar = lazy(() => import("../pages/avatar"));
const Progress = lazy(() => import("../pages/progress"));
const Tabs = lazy(() => import("../pages/tabs"));
const Pagination = lazy(() => import("../pages/pagination"));
const Badges = lazy(() => import("../pages/badges"));
const Tooltip = lazy(() => import("../pages/tooltip"));
const Videos = lazy(() => import("../pages/videos"));
const StarRating = lazy(() => import("../pages/star-rating"));
const Tags = lazy(() => import("../pages/tags"));
const List = lazy(() => import("../pages/list"));
const Radio = lazy(() => import("../pages/radio"));
const Switch = lazy(() => import("../pages/switch"));
const ImageUpload = lazy(() => import("../pages/image-upload"));
const Form = lazy(() => import("../pages/form"));
const FormLayout = lazy(() => import("../pages/form-layout"));
const FormValidation = lazy(() => import("../pages/form-validation"));
const Wizard = lazy(() => import("../pages/wizard"));
const BasicTable = lazy(() => import("../pages/table-basic"));
const DataTable = lazy(() => import("../pages/table-data"));
const LineChart = lazy(() => import("../pages/line-chart"));
const ColumnChart = lazy(() => import("../pages/column-chart"));
const PieChart = lazy(() => import("../pages/pie-chart"));
const Widgets = lazy(() => import("../pages/widgets"));
const UsersList = lazy(() => import("../pages/users-list"));
const UsersGrid = lazy(() => import("../pages/users-grid"));
const AddUser = lazy(() => import("../pages/add-user"));
const ViewProfile = lazy(() => import("../pages/view-profile"));
const SignIn = lazy(() => import("../pages/sign-in"));
const SignUp = lazy(() => import("../pages/sign-up"));
const ForgotPassword = lazy(() => import("../pages/forgot-password"));
const Gallery = lazy(() => import("../pages/gallery"));
const Error = lazy(() => import("../pages/error"));
const Faq = lazy(() => import("../pages/faq"));
const Pricing = lazy(() => import("../pages/pricing"));
const TermsCondition = lazy(() => import("../pages/terms-condition"));
const Company = lazy(() => import("../pages/company"));
const Notification = lazy(() => import("../pages/notification"));
const NotificationAlert = lazy(() => import("../pages/notification-alert"));
const Theme = lazy(() => import("../pages/theme"));
const Currencies = lazy(() => import("../pages/currencies"));
const Language = lazy(() => import("../pages/language"));
const PaymentGateway = lazy(() => import("../pages/payment-gateway"));
const New = lazy(() => import("../pages/new"));


const DashboardPage = lazy(() => import("../page/dashboard"));
const Report = lazy(() => import("../page/report"));
const Expertise = lazy(() => import("../page/expertise"));
const Mobile = lazy(() => import("../page/mobile"));
const Daily = lazy(() => import("../page/daily"));
const Furniture = lazy(() => import("../page/furniture"));
const Development = lazy(() => import("../page/development"));
const Usefull = lazy(() => import("../page/usefull"));
const Viewer = lazy(() => import("../page/viewer"));
const ChatPage = lazy(() => import("../page/chat"));
const Word = lazy(() => import("../page/word"));
const WordTwo = lazy(() => import("../page/word2"));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div className="flex justify-center items-center w-full h-full min-h-[100vh]">
        <img src="/assets/jamoa.png" alt="Loading..." />
      </div>}>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<Main />}>
            <Route path="/page/dashboard" element={<DashboardPage />} />
            <Route path="/page/report" element={<Report />} />
            <Route path="/page/expertise" element={<Expertise />} />
            <Route path="/page/mobile" element={<Mobile />} />
            <Route path="/page/daily" element={<Daily />} />
            <Route path="/page/furniture" element={<Furniture />} />
            <Route path="/page/development" element={<Development />} />
            <Route path="/page/usefull" element={<Usefull />} />
            <Route path="/page/viewer" element={<Viewer />} />
            <Route path="/page/chat" element={<ChatPage />} />
            <Route path="/page/word" element={<Word />} />
            <Route path="/page/word2" element={<WordTwo />} />
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
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/column-chart" element={<ColumnChart />} />
            <Route path="/pie-chart" element={<PieChart />} />
            <Route path="/widgets" element={<Widgets />} />
            <Route path="/users-list" element={<UsersList />} />
            <Route path="/users-grid" element={<UsersGrid />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/view-profile" element={<ViewProfile />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/error" element={<Error />} />
            <Route path="/terms-condition" element={<TermsCondition />} />
            <Route path="/company" element={<Company />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/notification-alert" element={<NotificationAlert />} />
            <Route path="/theme" element={<Theme />} />
            <Route path="/currencies" element={<Currencies />} />
            <Route path="/language" element={<Language />} />
            <Route path="/payment-gateway" element={<PaymentGateway />} />
            <Route path="/create" element={<New />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
