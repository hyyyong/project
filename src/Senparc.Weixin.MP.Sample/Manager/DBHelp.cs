using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager
{

    public class SqlConfig
    {
        public static string CONNECTION_STRING = "";    
        public static string CONNECTION_MAINDB = "";

    }
    public class DBHelp
    {
        SqlConnection sqlCon;
        DataSet ds;
        SqlCommand sqlCmd;
        SqlDataAdapter sqlAdp;


        public bool InsertSql(string strCmd, SqlParameter[] pars)
        {
            try
            {
                //string Parameter = "";
                //if (pars != null)
                //{
                //    for (int i = 0; i < pars.Length; i++)
                //    {
                //        Parameter += "name：" + pars[i].ParameterName + ",value：" + pars[i].Value + "；";
                //    }
                //}


                //using (sqlCon = new SqlConnection(SqlConfig.CONNECTION_OPERATE))
                //{
                //    string str = "insert into SqlTable(sqlCmd,Parameter,Time) values(@sqlCmd,@Parameter,GETDATE())";
                //    sqlCmd = new SqlCommand(str, sqlCon);
                //    sqlCmd.Parameters.Add(new SqlParameter("sqlCmd", strCmd));
                //    sqlCmd.Parameters.Add(new SqlParameter("Parameter", Parameter));
                //    sqlCon.Open();
                //    sqlCmd.ExecuteNonQuery();
                //    sqlCon.Close();

                //}
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }



        public bool ExecuteNonQuery(string strConn, string strCmd, SqlParameter[] pars)
        {
            try
            {
                InsertSql(strCmd, pars);

                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    sqlCon.Open();
                    sqlCmd.ExecuteNonQuery();
                    sqlCon.Close();

                }
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public int ExecuteNonQuery(string strConn, string strCmd, SqlParameter[] pars, bool flag, bool isProcedure)
        {
            try
            {
                InsertSql(strCmd, pars);
                int count = 0;
                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    if(isProcedure)
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCon.Open();
                    count = sqlCmd.ExecuteNonQuery();
                    sqlCon.Close();

                }
                return count;
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public int ExecuteNonQueryError(string strConn, string strCmd, SqlParameter[] pars, bool flag, bool isProcedure, out string info)
        {
            try
            {
                info = "";
                int count = 0;
                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    if (isProcedure)
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                    sqlCon.Open();
                    count = sqlCmd.ExecuteNonQuery();
                    sqlCon.Close();

                }
                return count;
            }
            catch (Exception ex)
            {
                info = ex.ToString();
                return 0;
            }
        }


        public bool QueryDataSet(string strConn, string strCmd, SqlParameter[] pars, bool isProcedure, out DataTable dtable)
        {
            try
            {
                InsertSql(strCmd, pars);
                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    if (isProcedure)
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                    sqlAdp = new SqlDataAdapter(sqlCmd);
                    ds = new DataSet();
                    sqlAdp.Fill(ds);
                }
                dtable = ds.Tables[0];
               return true;
            }
            catch (Exception)
            {
                dtable = null;
                return false;
            }
        }

        public bool QueryDataSet(string strConn, string strCmd, SqlParameter[] pars, bool isProcedure, out DataTable dtable,out string info)
        {
            info = "";
            try
            {
                InsertSql(strCmd, pars);
                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    if (isProcedure)
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                    sqlAdp = new SqlDataAdapter(sqlCmd);
                    ds = new DataSet();
                    sqlAdp.Fill(ds);
                }
                dtable = ds.Tables[0];
                return true;
            }
            catch (Exception e)
            {
                dtable = null;
                info = e.ToString();
                return false;
            }
        }

        public bool QueryDataSet(string strConn, string strCmd, SqlParameter[] pars, bool isProcedure, out DataSet dtset)
        {
            try
            {
                InsertSql(strCmd, pars);
                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    if (isProcedure)
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                    sqlAdp = new SqlDataAdapter(sqlCmd);
                    ds = new DataSet();
                    sqlAdp.Fill(ds);
                }
                dtset = ds;
                return true;
            }
            catch (Exception)
            {
                dtset = null;
                return false;
            }
        }


        public bool QueryDataSet1(string strConn, string strCmd, SqlParameter[] pars, bool isProcedure, out DataSet dtset,out string errinfo)
        {
            try
            {
                InsertSql(strCmd, pars);
                errinfo = "";
                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    if (isProcedure)
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                    sqlAdp = new SqlDataAdapter(sqlCmd);
                    ds = new DataSet();
                    sqlAdp.Fill(ds);
                }
                dtset = ds;
                return true;
            }
            catch (Exception ex)
            {
                dtset = null;
                errinfo = ex.ToString();
                return false;
            }
        }


        public bool ReadData(string strConn, string strCmd, SqlParameter[] pars, bool isProcedure, out DataTable dtable)
        {
            try
            {
                InsertSql(strCmd, pars);
                using (sqlCon = new SqlConnection(strConn))
                {
                    sqlCmd = new SqlCommand(strCmd, sqlCon);
                    sqlCmd.Parameters.AddRange(pars);
                    if (isProcedure)
                        sqlCmd.CommandType = CommandType.StoredProcedure;

                    dtable = new DataTable();
                    sqlCon.Open();
                    dtable.Load(sqlCmd.ExecuteReader());
 
                    sqlCon.Close();
                }
                return true;
            }
            catch (Exception)
            {
                dtable = null;
                return false;
            }
        }

        /// <summary>
        /// 批量新增数据到数据库
        /// </summary>
        /// <param name="strConn"></param>
        /// <param name="tableName"></param>
        /// <param name="dt"></param>
        /// <returns></returns>
        public bool ExecuteTable(string strConn, string tableName, DataTable dt)
        {
            bool ok = true;
            try
            {
                using (SqlConnection conn = new SqlConnection(strConn))
                {
                    conn.Open();
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(conn))
                    {
                        bulkCopy.DestinationTableName = tableName;
                        bulkCopy.BatchSize = dt.Rows.Count;
                        if (dt != null && dt.Rows.Count != 0)
                        {
                            bulkCopy.WriteToServer(dt);
                        }
                    }
                }
            }
            catch
            {
                ok = false;
            }
            return ok;
        }


        /// <summary>
        /// 批量新增数据到数据库
        /// </summary>
        /// <param name="strConn"></param>
        /// <param name="tableName"></param>
        /// <param name="dt"></param>
        /// <returns></returns>
        public bool ExecuteTable(string strConn, string tableName, DataTable dt,out string error)
        {
            error = "";
            bool ok = true;
            try
            {
                using (SqlConnection conn = new SqlConnection(strConn))
                {
                    conn.Open();
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(conn))
                    {
                        bulkCopy.DestinationTableName = tableName;
                        bulkCopy.BatchSize = dt.Rows.Count;
                        if (dt != null && dt.Rows.Count != 0)
                        {
                            bulkCopy.WriteToServer(dt);
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                error = ex.ToString();
                ok = false;
            }
            return ok;
        }


        /// <summary>
        /// 根据用户获取车组
        /// </summary>
        /// <param name="uid"></param>
        /// <returns></returns>
        public string GetVehGroupIDByUserID(string uid)
        {
            //string sqlCmd = "RetCUserByUserID";
            //DataTable table;
            //if (!QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("UserID", uid) }, true, out table))
            //{
            //    return "";
            //}
            //if (table.Rows.Count == 0)
            //    return "";
            //string VehGroupID = "";
            //DataTable dt;
            //sqlCmd = "RetAllVehGroupByUserID";
            //for (int i = 0; i < table.Rows.Count; i++)
            //{
            //    if (QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("userID", table.Rows[i][0]) }, true, out dt))
            //    {
            //        for (int j = 0; j < dt.Rows.Count; j++)
            //        {
            //            VehGroupID += dt.Rows[j][0].ToString() + ",";
            //        }
            //    }
            //}
            //if (VehGroupID != "")
            //{
            //    VehGroupID = VehGroupID.Substring(0, VehGroupID.Length - 1);
            //}

            string VehGroupID = "";
            DataTable table;
            string sqlCmd = "RetAllVehGroupIdByUserIdandChild";
            if (!QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("UserID", uid) }, true, out table))
                return "";
            else
            {
                if (table.Rows.Count == 0)
                    return "-1";

                for (int i = 0; i < table.Rows.Count; i++)
                {
                    if (i == 0)
                        VehGroupID = "'" + table.Rows[i][0].ToString() + "'";
                    else
                        VehGroupID += ",'" + table.Rows[i][0].ToString() + "'";

                }
            }

            return VehGroupID;
        }

    }
}
