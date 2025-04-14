# 一、Bean扫描
### 写法：
* 标签：<context:component-scan base-package = "com.itheima"/>
* 注解：@ComponentScan(basePackages="com.itheima")
> **SpringBoot默认扫描启动类所在的包及其子包**

# 二、Bean注册
![[Pasted image 20250408230158.png]]
_⚠如果要注册的bean对象来自第三方（不是自定义的），是无法用@Component及衍生注解声明bean对象的_

**解决方案:**
 * **@Bean** 
	 ![[Pasted image 20250408231323.png]]
	 ![[Pasted image 20250408231629.png]]
 * **@Import** 
	 
