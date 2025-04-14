## 一、JDBC的概念
	~ JDBC：Java Database Connectivity，Java数据库链接。
	~ JDBC是Java提供的一组独立于任何数据库管理系统的API
	~ Java提供接口规范，由各个数据库厂商提供接口的实现，厂商提供的实现类封装成jar文件，也就是我们俗称的数据库驱动jar包。
	~ 学习JDBC，充分提现了面向接口编程的好处，程序员只关心标准和规范，而无需关注实现过程。

### JDBC的简单执行过程
![[Pasted image 20250404174349.png]]

## 二、JDBC的核心组成
1. 接口规范：
	1. 为了项目代码的可移植性，SUN公司从最初就制定了Java程序链接各种数据库的统一接口规范。
	2. 接口存储在`java.sql`和`javax.sql`包下
2. 实现规范：
	1. 因为各个数据库厂商的DBMS软件各有不同，那么各自的内部如何通过SQL实现`增`、`删`、`改`、`查`等操作管理数据，只有这个数据库厂商自己更清楚，因此把接口规范的实现交给各个数据库厂商自己实现。
	2. 厂商将实现内容和过程封装成jar文件，我们程序员只需要将jar文件引用到项目中集成即可，就可以开发调用实现过程操作数据库了。

## 三、JDBC入门
1. JDBC搭建步骤
	1. 准备数据库。
	2. 官网下载数据库连接驱动jar包。[https://downloads.mysql.com/archives/c-j/](https://downloads.mysql.com/archives/c-j/)
	3. 创建Java项目，在项目下创建lib文件夹，将下载的驱动jar包复制到文件夹里。
	4. 选中lib文件夹右键->Add as Library，与项目集成。
	5. 编写代码
2.  核心代码：
	```java
/*  
* JDBC 核心六步  
* */  
// 1. 注册驱动  
Class.forName("com.mysql.cj.jdbc.Driver");  
  
// 2. 获取链接对象  
String url = "jdbc:mysql://localhost:3306/atguigu";  
String username = "root";  
String password = "123456";  
Connection connection = DriverManager.getConnection(url, username, password);  
  
// 3. 获取执行SQL语句的对象  
Statement statement = connection.createStatement();  
  
// 4. 编写SQL语句，并执行，接受返回的结果集  
String sql = "SELECT emp_id,emp_name,emp_salary,emp_age from t_emp";  
ResultSet resultSet = statement.executeQuery(sql);  
  
// 5. 处理结果，遍历resultSet结果集  
while (resultSet.next()) {  
    int empId = resultSet.getInt("emp_id");  
    String empName = resultSet.getString("emp_name");  
    double empSalary = resultSet.getDouble("emp_salary");  
    int empAge = resultSet.getInt("emp_age");  
    System.out.println(empId + "\t" + empName + "\t" + empSalary + "\t" + empAge);  
}  
  
// 6. 释放资源 (先开后关原则)  
resultSet.close();  
statement.close();  
connection.close(); 
```

## 四、核心API理解
#### 4.1 注册驱动
1. `Class.forName("com.mysql.cj.jdbc.Driver"); ` 
2.  在Java中，当使用JDBC链接数据库时，需要加载数据库特定的驱动，以便与数据库进行通信。加载驱动程序的目的是为了注册驱动程序，使得JDBC API能够识别并与特定的数据库进行交互。
3. 从JDK6开始，不再需要显式地调用`Class.forName()`来加载JDBC驱动程序，只要在类路径中集成了对应的jar文件，会自动在初始化时注册驱动程序。
#### 4.2 Connection
1. Connection接口是JDBCAPI的重要接口，用于建立与数据库的通信通道。换而言之，Connection对象不为空，则代表一次数据库连接。
2. 在建立连接时，需要指定数据库URL、用户名、密码参数。
	1. URL: jdbc:mysql://localhost:3306/atguigu
		1. jdbc:mysql://IP地址:端口号/数据库名称?参数键值对1&参数键值对2
3. `Connection`接口还负责管理事务，`Connection`接口提供了`commit`和`rollback`方法，用于提交事务和回滚事务。  
4. 可以创建`Statement`对象，用于执行SQL语句并与数据库进行交互。
5. 在使用JDBc技术时，必须要先获取Connection对象，在使用完毕后，要释放资源，避免资源占用浪费及泄漏。


# 连接池

## Druid连接池软编码实现
> **DruidTest.java**
```java
@Test  
public void testResourcesDruid() throws Exception {  
    // 1. 创建Properties集合，用于存储外部配置文件的key和value值  
    Properties properties = new Properties();  
  
    // 2. 读取外部配置文件，获取输入流，加载到Properties集合中  
    InputStream inputStream = DruidTest.class.getClassLoader().getResourceAsStream("db.properties");  
    properties.load(inputStream);  
  
    // 3. 基于Properties集合构建DruidDataSource连接池  
    DataSource dataSource = DruidDataSourceFactory.createDataSource(properties);  
  
    // 4. 通过连接池获取连接对象  
    Connection connection = dataSource.getConnection();  
    System.out.println(connection);  
  
    // 5. 开发CRUD  
  
    // 6. 回收连接  
    connection.close();  
}
```

> **db.properties**
```properties
driverClassName=com.mysql.cj.jdbc.Driver  
url=jdbc:mysql:///atguigu  
username=root  
password=123456  
initialSize=10  
maxActive=20
```

## Hikari连接池硬编码实现
>**HikariTest.java**
```java
/*  
硬编码：将连接池的配置信息和java代码耦合在一起  
1. 创建HikariDataSource连接池对象  
2. 设置连接池的配置信息 [必须 | 非必须]  
3. 通过连接池获取连接对象  
4. 回收连接  
*/  
@Test  
public void testHardCoreHikari() throws SQLException {  
    // 1. 创建HikariDataSource连接池对象  
    HikariDataSource hikariDataSource = new HikariDataSource();  
  
    // 2. 设置连接池的配置信息 [必须 | 非必须]  
    // 2.1 必须设置的配置参数  
    hikariDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");  
    hikariDataSource.setJdbcUrl("jdbc:mysql:///atguigu");  
    hikariDataSource.setUsername("root");  
    hikariDataSource.setPassword("123456");  
  
    // 2.2 非必要设置的配置参数  
    hikariDataSource.setMinimumIdle(10);  
    hikariDataSource.setMaximumPoolSize(20);  
  
    // 3. 通过连接池获取连接对象  
    Connection connection = hikariDataSource.getConnection();  
    System.out.println(connection);  
  
    // 4. 回收连接  
    connection.close();  
}
```

## Hikari连接池软编码实现
>**hikari.properties**
```properties
driverClassName=com.mysql.cj.jdbc.Driver  
jdbcUrl=jdbc:mysql:///atguigu  
username=root  
password=123456  
minimumIdle=10  
maximumPoolSize=20
```

> **HikariTest.java**
```java
@Test  
public void testResourcesHikari() throws IOException, SQLException {  
    // 1. 创建Properties集合，用于存储外部配置文件的key和value值  
    Properties properties = new Properties();  
  
    // 2. 读取外部配置文件，获取输入流，加载到Properties集合中  
    InputStream inputStream = HikariTest.class.getClassLoader().getResourceAsStream("hikari.properties");  
    properties.load(inputStream);  
  
    // 3. 创建HikariConfig连接池配置对象，将Properties集合传进去  
    HikariConfig hikariConfig = new HikariConfig(properties);  
  
    // 4. 基于HikariConfig连接池配置对象，构建HikariDataSource  
    HikariDataSource hikariDataSource = new HikariDataSource(hikariConfig);  
  
    // 5. 通过连接池获取连接对象  
    Connection connection = hikariDataSource.getConnection();  
    System.out.println(connection);  
  
    // 6. 回收连接  
    connection.close();  
}
```

> ==hikari和druid软编码上有所不同，注意仔细区分二者的差别==


# 工具类封装
* **问题引出：** 在使用JDBC的过程中，部分代码出现冗余的情况
	1. 创建连接池。
	2. 获取连接。
	3. 连接的回收。

> **JDBCUtil.java**
```java
/**  
 * JDBC工具类（V1.0）  
 *  1. 维护一个连接池对象  
 *  2. 对外提供在连接池中获取连接的方法  
 *  3. 对外提供回收连接的方法  
 * 注意：工具类仅对外提供共性的功能代码，所以方法均为静态方法！  
 */  
public class JDBCUtil {  
    // 创建连接池引用， 因为要提供给当前项目的全局使用，所以创建为静态的  
    private static DataSource dataSource;  
  
    // 在项目启动时，即创建连接池对象，赋值给dataSource  
    static {  
        try {  
            Properties properties = new Properties();  
            InputStream inputStream = JDBCUtil.class.getClassLoader().getResourceAsStream("db.properties");  
            properties.load(inputStream);  
  
            dataSource = DruidDataSourceFactory.createDataSource(properties);  
        } catch (Exception e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    // 对外提供在连接池中获取连接的方法  
    public static Connection getConnection() {  
        try {  
            return dataSource.getConnection();  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    // 对外提供回收连接的方法  
    public static void release(Connection connection) {  
        try {  
            connection.close();  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
}
```

> **测试类：JDBCUtilTest.java**
```java
@Test  
public void testJDBCUtilConnection() {  
    // 创建连接  
    Connection connection = JDBCUtil.getConnection();  
    System.out.println(connection);  
  
    // CRUD - 略  
  
    // 回收连接  
    JDBCUtil.release(connection);  
}
```
