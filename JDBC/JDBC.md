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
------------------------------


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

--------------------------------------------------------

# ThreadLocal
> JDK 1.2的版本中就提供了`java.lang.ThreadLocal`，为解决多线程程序的并发问题提供了一种新的思路。使用这个工具类可以很简洁的编写出优美的多线程程序。通常用来在多线程中管理共享数据库连接、Session等
> 
> ThreadLocal用于保存某个线程共享变量，原因是在Java中，每一个线程对象都有一个`ThreadLocalMap<ThreadLocal, Object>`，其key就是一个ThreadLocal，而Object即为该线程的共享变量。
> 
> 而这个map是通过ThreadLocal的set和get方法操作的。对于同一个static ThreadLocal，不同线程只能从中get，set，remove自己的变量，而不会影响其他线程的变量。
> 	1. 在进行对象跨层传递的时候，使用TreadLocal可以避免多次传递，打破层次间的约束
> 	2. 线程间数据隔离
> 	3. 进行事物操作，用于存储线程事物信息
> 	4. 数据库连接，`Session`会话管理
> 
> 1. `ThreadLocal对象.get`：获取ThreadLocal中当前线程共享变量的值
> 2. `ThreadLocal对象.set`：设置ThreadLocal中当前线程共享变量的值
> 3. `ThreadLocal对象.remove`：移除ThreadLocal中当前线程共享变量的值


# 工具类封装
* **问题引出：** 在使用JDBC的过程中，部分代码出现冗余的情况
	1. 创建连接池。
	2. 获取连接。
	3. 连接的回收。
##  V1.0
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

## V2.0 -- 通过ThreadLocal优化后
> **JDBCUtilV2.java**

```java
/**  
 * JDBC工具类（V2.0）  
 * 1. 维护一个连接池对象，维护了一个线程绑定变量的ThreadLocal对象  
 * 2. 对外提供在ThreadLocal中获取连接的方法  
 * 3. 对外提供回收连接的方法，在回收过程中，将要回收的连接从TreadLocal中移除  
 * 注意：工具类仅对外提供共性的功能代码，因此方法都是静态方法！  
 * 注意：使用TreadLocal就是为了一个线程在多次数据库操作过程中，使用的是同一个连接！  
 */  
public class JDBCUtilV2 {  
    // 创建连接池引用，因为要作为项目的全局使用，因此是静态的  
    private static DataSource dataSource;  
    private static ThreadLocal<Connection> threadLocal = new ThreadLocal<>();  
  
  
    // 在项目启动时，就创建连接池对象，赋值给dataSource  
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
  
    // 对外提供在ThreadLocal中获取连接的方法  
    public static Connection getConnection() {  
        try {  
            // 在TreadLocal中获取Connection  
            Connection connection = threadLocal.get();  
            // threadLocal里没有存储Connection，也就是第一次获取  
            if (connection == null) {  
                // 在连接池中获取一个连接，存储在ThreadLocal里  
                connection = dataSource.getConnection();  
                threadLocal.set(connection);  
            }
            return connection;
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    // 对外提供回收连接的方法，在回收过程中，将要回收的连接从TreadLocal中移除  
    public static void release() {  
        try {  
            Connection connection = threadLocal.get();  
            if (connection != null) {  
                // 从threadLocal中移除当前已经存在的Connection对象  
                threadLocal.remove();  
                // 将Connection对象归还给连接池  
                connection.close();  
            }  
        } catch (SQLException e) {  
            throw new RuntimeException(e);  
        }  
    }  
}
```

> **JDBCUtilTest.java**

```java
// V1.0测试代码
Connection connection1 = JDBCUtil.getConnection();  
Connection connection2 = JDBCUtil.getConnection();  
Connection connection3 = JDBCUtil.getConnection();  
System.out.println(connection1);  
System.out.println(connection2);  
System.out.println(connection3);

// V1.0版本多次调用测试结果 -- 调用三次，拿到的是三个不同的连接
Apr 15, 2025 9:22:10 AM com.alibaba.druid.pool.DruidDataSource info
INFO: {dataSource-1} inited
com.alibaba.druid.pool.DruidStatementConnection@6f36c2f0
com.alibaba.druid.pool.DruidStatementConnection@f58853c
com.alibaba.druid.pool.DruidStatementConnection@1224144a

// V2.0测试代码
Connection connection1 = JDBCUtilV2.getConnection();  
Connection connection2 = JDBCUtilV2.getConnection();  
Connection connection3 = JDBCUtilV2.getConnection();  
System.out.println(connection1);  
System.out.println(connection2);  
System.out.println(connection3);

// V2.0版本多次调用测试结果 -- 调用三次，拿到的是同一个连接
Apr 15, 2025 9:25:35 AM com.alibaba.druid.pool.DruidDataSource info
INFO: {dataSource-1} inited
com.alibaba.druid.pool.DruidStatementConnection@2584b82d
com.alibaba.druid.pool.DruidStatementConnection@2584b82d
com.alibaba.druid.pool.DruidStatementConnection@2584b82d
```


# DAO封装以及BaseDAO工具类
## DAO概念
> **DAO：Data Access Object， 数据访问对象**
> 
> **Java是面向对象语言，数据在Java中通常以对象的形式存在，一张表对应一个实体类，一张表的操作对应一个DAO对象**
> 
> **在Java操作数据库时，我们会将同一张表的增删改查操作统一起来，维护的这个类就是DAO层**
> 
> **DAO层只关注对数据库的操作，供业务层Service调用，将职责划分清楚**

## BaseDAO概念
> **基本上每一个数据表都应该有一个对应的DAO接口以及实现类，发现对所有表的操作（增、删、改、查）代码重复度很高，所以可以抽取公共代码，给这些DAO的实现类可以抽取一个公共的父类，复用这些增删改查的基本操作，我们称之为BaseDAO**

## 通过Product数据库表来举例说明
> **pojo/Product.java** - Product实体类
```java
public class Product {  
    private Integer id; 
    private String name;
    private Double price;
    private String categoryId;
	// 构造函数
    public Product() { 
    }
    public Product(Integer id, String name, Double price, String categoryId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
    }

	// getter、setter
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public String getCategoryId() {  
        return categoryId;  
    }  
    public void setCategoryId(String categoryId) {  
        this.categoryId = categoryId;  
    }  

	// toString()
    @Override  
    public String toString() {  
        return "Product{" +  
                "id=" + id +  
                ", name='" + name + '\'' +  
                ", price=" + price +  
                ", categoryId='" + categoryId + '\'' +  
                '}';  
    }  
}
```

> **dao/ProductDAO.java** -- product表的增删改查操作
```java
/**  
 * ProductDAO这个类对应的是product这张表的增删改查的操作  
 */  
public interface ProductDAO {  
    /**  
     * 数据库对应的查询所有的操作  
     * @return 表中所有的数据  
     */  
    List<Product> selectAll();  
  
    /**  
     * 数据库对应的根据id查询单个商品的数据操作  
     * @param id 主键列  
     * @return 一个商品对象（一行数据）  
     */  
    Product selectById(Integer id);  
  
    /**  
     * 数据库对应的新增一个商品数据  
     * @param product ORM思想中的一个商品对象  
     * @return 受影响的行数  
     */  
    int insert(Product product);  
  
    /**  
     * 数据库对应的修改一个商品数据  
     * @param product ORM思想中一个商品对象  
     * @return 受影响的行数  
     */  
    int update(Product product);  
  
    /**  
     * 数据库对应的删除一个商品数据  
     * @param id 主键列  
     * @return 受影响的行数  
     */  
    int delete(Integer id);  
}
```

> **dao/impl/ProductDAOImpl.java** -- 增删改查的实现
```java
public class ProductDAOImpl implements ProductDAO {  
    @Override  
    public List<Product> selectAll() {  
        // 1. 注册驱动  
  
        // 2. 获取连接  
  
        // 3. 预编译SQL语句  
  
        // 4. 为占位符赋值，执行SQL，接收返回结果  
  
        // 5. 处理结果  
  
        // 6. 回收连接  
        return List.of();  
    }  
  
    @Override  
    public Product selectById(Integer id) {  
        return null;  
    }  
  
    @Override  
    public int insert(Product product) {  
        return 0;  
    }  
  
    @Override  
    public int update(Product product) {  
        return 0;  
    }  
  
    @Override  
    public int delete(Integer id) {  
        return 0;  
    }  
}
```

> **dao/impl/BaseDAO.java** -- 共性的数据库操作
```java
/**  
 * 将共性的数据库操作封装在BaseDAO中  
 */  
public class BaseDAO {  
    /**  
     * 通用的增删改的方法  
     * @param sql 调用者要执行的SQL语句  
     * @param params SQL语句中占位符要赋值的参数  
     * @return 受影响的行数  
     */  
    public int executeUpdate(String sql, Object... params) throws SQLException {  
        // 1. 通过JDBCUtilV2获取数据库连接  
        Connection connection = JDBCUtilV2.getConnection();  
  
        // 2. 预编译SQL语句  
        PreparedStatement preparedStatement = connection.prepareStatement(sql);  
  
        // 3. 为占位符赋值，执行SQL，接收返回结果  
        if (params != null && params.length > 0) {  
            for (int i = 0; i < params.length; i++) {  
                // 占位符是从1开始的，参数的数组是从0开始的  
                preparedStatement.setObject(i+1, params[i]);  
            }  
        }  
        int row = preparedStatement.executeUpdate();  
  
        // 4. 释放资源  
        preparedStatement.close();  
        JDBCUtilV2.release();  
  
        // 5. 返回结果  
        return row;  
    }  
	/**  
	 * 通用的查询：多行多列、单行多列、单行单列  
	 *      多行多列：List<Employee>  
	 *      单行多列：Employee  
	 *      单行单列：封装的是一个结果。Double、Integer......  
	 * 封装过程：  
	 *      1. 返回的类型：泛型，类型不确定，但是调用者知道，那么调用的时候，将此次查询的结果类型告知BaseDAO就可以了 T Employee|Double  
	 *      2. 返回的结果：通用，List 可以存储多个结果，也可以存储一个结果 get(0)  
	 *      3. 结果的封装：反射，要求调用者告知BaseDAO要封装对象的类对象. Class  
	 */
}
```
