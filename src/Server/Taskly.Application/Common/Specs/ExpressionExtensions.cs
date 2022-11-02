using System.Linq.Expressions;

namespace Taskly.Application.Common.Specs;

public static class ExpressionExtensions
{
	public static Func<TIn, TOut> ToLambda<TIn, TOut>(this Expression<Func<TIn, TOut>> exp) =>
		LambdaCache<TIn, TOut>.ToLambda(exp);

	public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
		=> left.Compose(right, Expression.OrElse);

	public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
		=> left.Compose(right, Expression.AndAlso);

	private static Expression<Func<T, bool>> Compose<T>(this Expression<Func<T, bool>> left,
		Expression<Func<T, bool>> right,
		Func<Expression, Expression, Expression> op)
	{
		var param = Expression.Parameter(typeof(T));
		var leftR = ParameterReplacer.Replace<Func<T, bool>, Func<T, bool>>(left, left.Parameters[0], param);
		var rightR = ParameterReplacer.Replace<Func<T, bool>, Func<T, bool>>(right, right.Parameters[0], param);
		var usingReplace = op(leftR.Body, rightR.Body);
		return Expression.Lambda<Func<T, bool>>(usingReplace, param);
	}
}
