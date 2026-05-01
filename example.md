5.1.1 数据库实现 
用户实体类（User）负责存储用户的基本信息，包括用户ID、用户名、密码、主题
ID 和头像路径等字段。通过Room框架将数据映射到SQLite数据库中，确保了数据存
取的高效性和安全性。 
在数据库中，用户信息保存在user表中，其中userId是主键，唯一标识每个用户，
其他字段分别存储用户的用户名、密码、主题ID和头像路径等信息。通过UserDao接
口实现对数据库的操作，UserDao提供了注册、登录、获取用户信息、更新头像和用户
名等功能的接口，操作包括插入、查询和更新用户数据。 
5.1.2 前端实现 
（1）注册功能 
通过activity_register.xml 创建注册界面，包含用户名、密码和确认密码输入框，以
及密码规则提示文本和注册按钮。RegisterActivity 处理用户输入验证并显示相应提示，
实现了密码规则检查（必须包含数字和字母且不少于6位），在注册成功后跳转到登录
页面。 
（2）登录功能 
登录界面通过activity_login.xml 实现，设计简洁的表单并使用CheckBox实现"记住
密码"功能。LoginActivity 负责处理用户登录逻辑，利用SharedPreferencesHelper 存储和
读取用户凭据，支持自动填充功能。登录成功后保存用户ID到SharedPreferences 并跳
转到主界面。 
（3）个人信息管理功能 
在fragment_me.xml 中设计个人页面，顶部展示用户头像和用户名，下方展示衣物
统计信息和功能入口。MeFragment 实现头像更换功能，支持拍照或从相册选择，并使
用Glide加载和裁剪图片为圆形。用户名修改功能通过AlertDialog实现，支持输入验证。


5.1.3 后端实现

（1）登录功能 
在登录过程中，系统接收用户输入的用户名和密码，调用UserDao的login()方法在
数据库中查找匹配的用户，login()方法会根据用户名和密码在数据库中执行查询操作，
如果查询到匹配的用户，且密码验证成功，则登录成功。若验证失败，系统会“用户名
或密码错误”的提示信息，要求用户重新输入正确的用户名或密码。若用户勾选“记住
密码”，系统会将用户ID保存在SharedPreferences 中，确保用户在应用重启后登录界
面依旧保留上次登录成功的用户名和密码。 
用户验证的相关核心代码如下。 
public boolean validateUser(String username, String password) { 
try { 
boolean isValid = userDao.checkUser(username, password); 
35 
华南理工大学学士学位论文 
if (isValid) {// 登录成功后保存用户 ID 
int userId = userDao.getUserId(username); 
if (userId != -1) { 
saveCurrentUserId(userId); 
return true; 
} 
} 
return false; 
} catch (Exception e) { 
Log.e(TAG, "Error validating user: " + e.getMessage()); 
return false; 
} 
} 
（2）注册功能 
在用户注册时，系统会调用RegisterPresenter中的register()方法。系统调用UserDao
的getUserByUsername()方法查询数据库，检查输入的用户名是否已存在。若用户名已存
在，则返回错误信息提示用户；若用户名未被占用，系统还会进行密码的一致性校验和
复杂性校验，在这两个校验都通过以后，系统则使用UserDao.insert()方法将用户的注册
信息插入到数据库中。注册成功后，系统会提示用户“注册成功”，并跳转至登录界面，
便于后续用户进行登录操作。 
（3）个人信息管理功能 
个人信息管理模块允许用户修改头像、用户名和密码。用户点击修改头像按钮后，
系统提供两种方式修改头像：一是从相册选择图片，二是使用拍照功能。无论选择哪种
方式，系统都会将图片保存到应用的私有存储目录，并更新头像路径存储到数据库中。
头像保存成功后，系统会使用Glide库加载头像并在界面中显示。 
修改用户名时，用户输入新的用户名，系统首先检查新用户名是否已被占用。调用
UserDao 的 getUserByUsername()方法进行查询，如果用户名唯一，系统将通过
UserDao.update()方法更新数据库中的用户名。 
修改密码时，系统会调用Presenter层中的updatePassword()方法对密码的一致性校
验和复杂性校验，在校验通过后则会调用Model层的updatePassword()方法将更新后的
密码保存到数据库中。 
36 
第五章 系统实现 
37 
5.1.4接口实现 
本模块功能的主要接口实现如表5-1所示。 
表5- 1 用户信息管理模块接口 
接口名称 接口说明 请求参数 返回值/回调方法 
LoginContract.login 用户登录验证 String username, String 
password 
Callback<User>.onS
uccess(User)/onError
(Exception) 
RegisterContract.register 用户注册 String username, String 
password, String 
confirmPassword 
Callback<Boolean>.o
nSuccess(Boolean) 
MeContract.updateUsername 修改用户名 String newUsername Callback<Boolean>.o
nSuccess(Boolean) 
MeContract.updateAvatar 更新用户头像 Uri photoUri Callback<String>.on
Success(String) 
MeContract.loadUserData 加载用户信息 — Callback<User>.onS
uccess(User)