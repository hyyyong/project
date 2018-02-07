using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Senparc.Weixin.MP.Sample.CommonService
{
    public class XmlHelper
    {

        public System.Collections.SortedList GetXml(string xmlFilePath)
        {
            try
            {
                //string xmlFilePath = @"X:\about.net\example\XmlExample\1.xml";
                XmlDocument doc = new XmlDocument();
                doc.Load(xmlFilePath);
                System.Collections.SortedList userInfo = new System.Collections.SortedList();
                //使用xpath表达式选择文档中所有的student子节点
                XmlNodeList studentNodeList = doc.SelectNodes("/Users/user");
                if (studentNodeList != null)
                {
                    foreach (XmlNode studentNode in studentNodeList)
                    {
                        //通过Attributes获得属性名字为name的属性
                        //string name = studentNode.Attributes["name"].Value;
                        //通过SelectSingleNode方法获得当前节点下的courses子节点
                        // XmlNode coursesNode = studentNode.SelectSingleNode("courses");

                        string username = studentNode.SelectSingleNode("username").InnerText;
                        string pwd = studentNode.SelectSingleNode("pwd").InnerText;
                        string userMd5 = studentNode.SelectSingleNode("userMd5").InnerText;
                        string sUpdateTime = studentNode.SelectSingleNode("sUpdateTime").InnerText;
                        string openId = studentNode.SelectSingleNode("openId").InnerText;
                        string userId = studentNode.SelectSingleNode("userId").InnerText;
                        string userType = studentNode.SelectSingleNode("userType").InnerText;
                        string groupId = studentNode.SelectSingleNode("groupId").InnerText;
                        if (userInfo.ContainsKey(username))
                        {
                            UserMd5 usermd5 = new UserMd5();
                            usermd5.username = username;
                            usermd5.pwd = pwd;
                            usermd5.userMd5 = userMd5;
                            usermd5.sUpdateTime = sUpdateTime;
                            usermd5.openId = openId;

                            usermd5.userId = userId;
                            usermd5.userType = userType;
                            usermd5.groupId = groupId;
                            userInfo[username] = usermd5;
                            
                        }
                        else
                        {
                            UserMd5 usermd5 = new UserMd5();
                            usermd5.username = username;
                            usermd5.pwd = pwd;
                            usermd5.userMd5 = userMd5;
                            usermd5.sUpdateTime = sUpdateTime;
                            usermd5.openId = openId;

                            usermd5.userId = userId;
                            usermd5.userType = userType;
                            usermd5.groupId = groupId;
                            userInfo.Add(username, usermd5);
                        }


                        //通过ChildNodes属性获得courseNode的所有一级子节点
                        //XmlNodeList courseNodeList = coursesNode.ChildNodes;
                        //if (courseNodeList != null)
                        //{
                        //    foreach (XmlNode courseNode in courseNodeList)
                        //    {
                        //        Console.Write("\t");
                        //        Console.Write(courseNode.Attributes["name"].Value);
                        //        Console.Write("老师评语");
                        //        //通过FirstNode属性可以获得课程节点的第一个子节点，LastNode可以获得最后一个子节点
                        //        XmlNode teacherCommentNode = courseNode.FirstChild;
                        //        //读取CData节点
                        //        XmlCDataSection cdata = (XmlCDataSection)teacherCommentNode.FirstChild;
                        //        Console.WriteLine(cdata.InnerText.Trim());
                        //    }
                        //}
                    }
                }
                return userInfo;
            }
            catch (Exception)
            {

                return null;
            }

        }
        public UserMd5 GetXml(string xmlFilePath, string openid)
        {
            try
            {
                //string xmlFilePath = @"X:\about.net\example\XmlExample\1.xml";
                XmlDocument doc = new XmlDocument();
                doc.Load(xmlFilePath);
                UserMd5 usermd5 = new UserMd5();
                //使用xpath表达式选择文档中所有的student子节点
                XmlNodeList studentNodeList = doc.SelectNodes("/Users/user");
                if (studentNodeList != null)
                {
                    foreach (XmlNode studentNode in studentNodeList)
                    {
                        if (studentNode.SelectSingleNode("openId").InnerText == openid)
                        {
                            //通过Attributes获得属性名字为name的属性
                            // string name = studentNode.Attributes["name"].Value;
                            //通过SelectSingleNode方法获得当前节点下的courses子节点
                            // XmlNode coursesNode = studentNode.SelectSingleNode("courses");

                            usermd5.username = studentNode.SelectSingleNode("username").InnerText;
                            usermd5.pwd = studentNode.SelectSingleNode("pwd").InnerText;
                            usermd5.userMd5 = studentNode.SelectSingleNode("userMd5").InnerText;
                            usermd5.sUpdateTime = studentNode.SelectSingleNode("sUpdateTime").InnerText;
                            usermd5.openId = studentNode.SelectSingleNode("openId").InnerText;

                            usermd5.userId = studentNode.SelectSingleNode("userId").InnerText;
                            usermd5.userType = studentNode.SelectSingleNode("userType").InnerText;
                            usermd5.groupId = studentNode.SelectSingleNode("groupId").InnerText;
                            break;
                        }
                    }
                }
                return usermd5;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public UserMd5 GetXml(string xmlFilePath, string vehid, string openid)
        {
            try
            {
                //string xmlFilePath = @"X:\about.net\example\XmlExample\1.xml";
                XmlDocument doc = new XmlDocument();
                doc.Load(xmlFilePath);
                UserMd5 usermd5 = new UserMd5();
                //使用xpath表达式选择文档中所有的student子节点
                XmlNodeList studentNodeList = doc.SelectNodes("/Users/user");
                if (studentNodeList != null)
                {
                    foreach (XmlNode studentNode in studentNodeList)
                    {
                        if (studentNode.SelectSingleNode("openId").InnerText == openid && studentNode.SelectSingleNode("userId").InnerText==vehid)
                        {
                            //通过Attributes获得属性名字为name的属性
                            // string name = studentNode.Attributes["name"].Value;
                            //通过SelectSingleNode方法获得当前节点下的courses子节点
                            // XmlNode coursesNode = studentNode.SelectSingleNode("courses");

                            usermd5.username = studentNode.SelectSingleNode("username").InnerText;
                            usermd5.pwd = studentNode.SelectSingleNode("pwd").InnerText;
                            usermd5.userMd5 = studentNode.SelectSingleNode("userMd5").InnerText;
                            usermd5.sUpdateTime = studentNode.SelectSingleNode("sUpdateTime").InnerText;
                            usermd5.openId = studentNode.SelectSingleNode("openId").InnerText;

                            usermd5.userId = studentNode.SelectSingleNode("userId").InnerText;
                            usermd5.userType = studentNode.SelectSingleNode("userType").InnerText;
                            usermd5.groupId = studentNode.SelectSingleNode("groupId").InnerText;
                            break;
                        }
                    }
                }
                return usermd5;
            }
            catch (Exception)
            {
                return null;
            }
        }
        public RequestXml GetEventType(string str)
        {
            try
            {
                string eventdata = "";
                RequestXml requestXml = new RequestXml();
                XmlDocument doc = new XmlDocument();
                StringReader sr = new StringReader(str);
                doc.Load(sr);              
                //使用xpath表达式选择文档中所有的student子节点
                XmlNodeList studentNodeList = doc.SelectNodes("/xml");
                if (studentNodeList != null)
                {
                    foreach (XmlNode studentNode in studentNodeList)
                    {

                        requestXml.FromUserName = studentNode.SelectSingleNode("FromUserName").InnerText;
                        requestXml.ToUserName = studentNode.SelectSingleNode("ToUserName").InnerText;
                        requestXml.EventKey = studentNode.SelectSingleNode("EventKey").InnerText; 
                       
                    }
                }
                return requestXml;
            }
            catch (Exception)
            {

                return null;
            }
        }

        public bool AddXml(string xmlFilePath, UserMd5 userMd5)
        {
            try
            {
                XmlDocument xmlDoc = new XmlDocument();
                //创建Xml声明部分，即<?xml version="1.0" encoding="utf-8" ?>
                // xmlDoc.CreateXmlDeclaration("1.0", "utf-8", "yes");
                xmlDoc.Load(xmlFilePath);
                //创建根节点
                XmlNode rootNode = xmlDoc.CreateElement("Users");

                //创建student子节点
                XmlNode user = xmlDoc.CreateElement("user");
                //创建一个属性
                XmlAttribute nameAttribute = xmlDoc.CreateAttribute("name");
                nameAttribute.Value = userMd5.username;
                //xml节点附件属性
                user.Attributes.Append(nameAttribute);


                //创建courses子节点
                XmlNode username = xmlDoc.CreateElement("username");
                //创建Cdata块
                XmlCDataSection cdata = xmlDoc.CreateCDataSection(userMd5.username);
                username.AppendChild(cdata);
                //附加子节点
                user.AppendChild(username);

                //创建courses子节点
                XmlNode pwd = xmlDoc.CreateElement("pwd");
                //创建Cdata块
                XmlCDataSection cdatapwd = xmlDoc.CreateCDataSection(userMd5.pwd);
                pwd.AppendChild(cdatapwd);
                //附加子节点
                user.AppendChild(pwd);

                //创建courses子节点
                XmlNode userMd51 = xmlDoc.CreateElement("userMd5");
                //创建Cdata块
                XmlCDataSection cdatauserMd51 = xmlDoc.CreateCDataSection(userMd5.userMd5);
                userMd51.AppendChild(cdatauserMd51);
                //附加子节点
                user.AppendChild(userMd51);


                //创建courses子节点
                XmlNode sUpdateTime = xmlDoc.CreateElement("sUpdateTime");
                //创建Cdata块
                XmlCDataSection cdatasUpdateTime = xmlDoc.CreateCDataSection(userMd5.sUpdateTime);
                sUpdateTime.AppendChild(cdatasUpdateTime);
                //附加子节点
                user.AppendChild(sUpdateTime);

                //创建courses子节点
                XmlNode openId = xmlDoc.CreateElement("openId");
                //创建Cdata块
                XmlCDataSection cdataopenId = xmlDoc.CreateCDataSection(userMd5.openId);
                openId.AppendChild(cdataopenId);
                //附加子节点
                user.AppendChild(openId);

                //创建courses子节点
                XmlNode userId = xmlDoc.CreateElement("userId");
                //创建Cdata块
                XmlCDataSection cdatauserId = xmlDoc.CreateCDataSection(userMd5.userId);
                userId.AppendChild(cdatauserId);
                //附加子节点
                user.AppendChild(userId);

                //创建courses子节点
                XmlNode userType = xmlDoc.CreateElement("userType");
                //创建Cdata块
                XmlCDataSection cdatauserType = xmlDoc.CreateCDataSection(userMd5.userType);
                userType.AppendChild(cdatauserType);
                //附加子节点
                user.AppendChild(userType);


                //创建courses子节点
                XmlNode groupId = xmlDoc.CreateElement("groupId");
                //创建Cdata块
                XmlCDataSection cdatagroupId = xmlDoc.CreateCDataSection(userMd5.groupId);
                groupId.AppendChild(cdatagroupId);
                //附加子节点
                user.AppendChild(groupId);

               
                // rootNode.AppendChild(user);
                //附加根节点
                xmlDoc.DocumentElement.AppendChild(user);
                // xmlDoc.AppendChild(rootNode);
                //保存Xml文档
                xmlDoc.Save(xmlFilePath);
                return true;
            }
            catch (Exception)
            {

                return false;
            }

        }



        public bool SetXml(string xmlFilePath, UserMd5 userMd5)
        {
            try
            {
                //string xmlFilePath = @"X:\about.net\example\XmlExample\1.xml";
                XmlDocument doc = new XmlDocument();
                doc.Load(xmlFilePath);
                UserMd5 usermd5 = new UserMd5();
                //使用xpath表达式选择文档中所有的student子节点
                XmlNodeList studentNodeList = doc.SelectNodes("/Users/user");
                if (studentNodeList != null)
                {
                    foreach (XmlNode studentNode in studentNodeList)
                    {
                        if (studentNode.SelectSingleNode("openId").InnerText == userMd5.userMd5)
                        {
                            //通过Attributes获得属性名字为name的属性
                            // string name = studentNode.Attributes["name"].Value;
                            //通过SelectSingleNode方法获得当前节点下的courses子节点
                            // XmlNode coursesNode = studentNode.SelectSingleNode("courses");

                            studentNode.SelectSingleNode("username").InnerText = userMd5.username;
                            studentNode.SelectSingleNode("pwd").InnerText = userMd5.pwd;
                            studentNode.SelectSingleNode("userMd5").InnerText = userMd5.userMd5;
                            studentNode.SelectSingleNode("sUpdateTime").InnerText = userMd5.sUpdateTime;
                            studentNode.SelectSingleNode("openId").InnerText = userMd5.openId;

                            studentNode.SelectSingleNode("userId").InnerText = userMd5.userId;
                            studentNode.SelectSingleNode("userType").InnerText = userMd5.userType;
                            studentNode.SelectSingleNode("groupId").InnerText = userMd5.groupId;
                            doc.Save(xmlFilePath);
                            break;
                        }
                    }
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }

        }


        public bool DelXml(string xmlFilePath, UserMd5 muserMd5)
        {
            try
            {


                //string xmlFilePath = @"X:\about.net\example\XmlExample\1.xml";
                XmlDocument doc = new XmlDocument();
                doc.Load(xmlFilePath);
                UserMd5 usermd5 = new UserMd5();
                //使用xpath表达式选择文档中所有的student子节点
                XmlNodeList studentNodeList = doc.SelectNodes("/Users/user");
                if (studentNodeList != null)
                {
                    foreach (XmlNode studentNode in studentNodeList)
                    {
                        if (studentNode.SelectSingleNode("openId").InnerText == muserMd5.openId)
                        {
                            //doc.RemoveChild(studentNode);
                            doc.DocumentElement.RemoveChild(studentNode);
                            doc.Save(xmlFilePath);
                            break;
                        }
                    }
                }
                return true;
            }
            catch (Exception)
            {

                return false;
            }

        }


    }
    public class UserMd5
    {
        public string username;//登录用户名
        public string pwd;//密码
        public string userMd5;//服务器返回的账户唯一标识符
        public string sUpdateTime;   //数据更新时间
        public string openId;//微信号唯一标识符
        public string userId;//用户id   
        public string userType;//用户类型 为1企业用户   为2个人用户
        public string groupId;//用户类型 为1企业用户   为2个人用户
    }


    public class RequestXml
    {
        public string ToUserName;
        public string FromUserName;
        public string EventKey;      



    }
}
