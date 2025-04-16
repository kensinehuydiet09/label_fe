import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Save,
  User,
  Mail,
  Shield,
  Lock,
  EyeOff,
  Eye,
  Wallet,
  MessageSquare,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/auth/AuthContext";
import useFormattedMonthYear from "@/hooks/useFormattedMonthYear";
import { capitalizeFirst } from "@/helper/stringHelpers";
import { formatNumber } from "@/helper/numberFormat";
import { apiService } from "@/services/api";
import Constants from "@/constants";

const Profile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [balance, setBalance] = useState(currentUser.data.balance);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [userInfo, setUserInfo] = useState({
    name: currentUser.data.username,
    email: currentUser.data.email,
    role: capitalizeFirst(currentUser.data.role),
    memberSince: useFormattedMonthYear(currentUser.data.createdAt),
    balance: formatNumber(balance) + " USD", // Giả định thông tin balance
    active: currentUser.data.active || true, // Giả định trạng thái active
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.get(`${Constants.API_ENDPOINTS.USER_PROFILE}`);
        if (response.success) {
          setBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);



  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState("personal");

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  const handlePasswordChange = async () => {
    // Validate and submit password change
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    if (passwordInfo.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    // API call would go here

    try {
      const response = await apiService.put(
        `${Constants.API_ENDPOINTS.USER_CHANGE_PASSWORD}`,
        {
          oldPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword,
        }
      );
      if (!response.success) {
        alert("Failed to update password. Please try again.");
        return;
      }

      alert("Password updated successfully");
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An error occurred while updating the password. Please try again.");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your Profile
          </h1>
          {activeTab === "personal" && (
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="transition-all duration-200"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 md:-mt-16">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background bg-background">
                  <AvatarImage
                    src="/api/placeholder/100/100"
                    alt={userInfo.name}
                  />
                  <AvatarFallback className="text-xl md:text-3xl bg-blue-100 text-blue-800">
                    {getInitials(userInfo.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center md:items-start mt-2 md:mt-0">
                  <h2 className="text-xl md:text-2xl font-bold">
                    {userInfo.name}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      {userInfo.role}
                    </Badge>
                    <span>•</span>
                    <span>Member since {userInfo.memberSince}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      className={`${
                        userInfo.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } flex items-center gap-1`}
                    >
                      {userInfo.active ? (
                        <>
                          <CheckCircle className="h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Inactive
                        </>
                      )}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-amber-50 text-amber-800 border-amber-200"
                    >
                      <Wallet className="h-3 w-3" />
                      Balance: {userInfo.balance}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Tabs
            defaultValue="personal"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name
                      </Label>
                      <div className="text-sm font-medium py-2 border-b border-muted">
                        {userInfo.name}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                      </Label>
                      <div className="text-sm font-medium py-2 border-b border-muted">
                        {userInfo.email}
                      </div>
                    </div>

                    {/* <div className="space-y-2">
                      <Label
                        htmlFor="telegram"
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        Telegram
                      </Label>
                      {isEditing ? (
                        <Input
                          id="telegram"
                          value={userInfo.telegram}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              telegram: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm font-medium py-2 border-b border-muted">
                          {userInfo.telegram}
                        </div>
                      )}
                    </div> */}

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        Role
                      </Label>
                      <div className="text-sm font-medium py-2 border-b border-muted">
                        {userInfo.role}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        Balance
                      </Label>
                      <div className="text-sm font-medium py-2 border-b border-muted">
                        {userInfo.balance}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        {userInfo.active ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        Status
                      </Label>
                      <div className="text-sm font-medium py-2 border-b border-muted">
                        {userInfo.active ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          value={passwordInfo.currentPassword}
                          onChange={(e) =>
                            setPasswordInfo({
                              ...passwordInfo,
                              currentPassword: e.target.value,
                            })
                          }
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("current")}
                        >
                          {showPassword.current ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          value={passwordInfo.newPassword}
                          onChange={(e) =>
                            setPasswordInfo({
                              ...passwordInfo,
                              newPassword: e.target.value,
                            })
                          }
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPassword.new ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="flex items-center gap-2"
                      >
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwordInfo.confirmPassword}
                          onChange={(e) =>
                            setPasswordInfo({
                              ...passwordInfo,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPassword.confirm ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-sm font-medium text-blue-800 ml-2">
                      Password Requirements
                    </AlertTitle>
                    <AlertDescription className="mt-2 ml-6 text-sm text-blue-700">
                      <ul className="list-disc space-y-1">
                        <li>At least 8 characters long</li>
                        <li>Include at least one uppercase letter</li>
                        <li>Include at least one lowercase letter</li>
                        <li>Include at least one number</li>
                        <li>
                          Include at least one special character (e.g.,
                          !@#$%^&*)
                        </li>
                      </ul>
                      <p className="mt-2 text-blue-600 font-medium">
                        Strong passwords significantly improve your account
                        security.
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button
                    onClick={handlePasswordChange}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
