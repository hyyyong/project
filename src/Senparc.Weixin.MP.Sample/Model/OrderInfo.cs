using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    class OrderInfo
    {
    }

    public class First
    {
        public string value { get; set; }
        public string color { get; set; }
    }

    public class Keyword1
    {
        public string value { get; set; }
        public string color { get; set; }
    }

    public class Keyword2
    {
        public string value { get; set; }
        public string color { get; set; }
    }

    public class Keyword3
    {
        public string value { get; set; }
        public string color { get; set; }
    }

    public class Keyword4
    {
        public string value { get; set; }
        public string color { get; set; }
    }

    public class Keyword5
    {
        public string value { get; set; }
        public string color { get; set; }
    }

    public class Remark
    {
        public string value { get; set; }
        public string color { get; set; }
    }

    public class Data
    {
        public First first { get; set; }
        public Keyword1 keyword1 { get; set; }
        public Keyword2 keyword2 { get; set; }
        public Keyword3 keyword3 { get; set; }
        public Keyword4 keyword4 { get; set; }
        public Keyword5 keyword5 { get; set; }
        public Remark remark { get; set; }
    }

    public class SendData
    {

        public string touser { get; set; }
        public string template_id { get; set; }
        public Data data { get; set; }
    }


    public class Alarm
    {
        public string touser { get; set; }
        public string template_id { get; set; }
        public string url { get; set; }
        public Miniprogram miniprogram { get; set; }
        public Data data { get; set; }
    }

    public class Miniprogram
    {
        public string appid { get; set; }
        public string pagepath { get; set; }
    }






}
